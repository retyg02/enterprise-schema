using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace EnterpriseSchema.Data
{
    public static class CryptoHelper
    {
        // теперь private
        private static byte[]? encryptionKey;

        // тоже нельзя подменить и заново вызвать сетер ключа 
        public static bool _isInitialized { get; private set; } = false;
        private static readonly object lock_lock = new object();

        public static void SetEncryptionKey(string key)
        {
            lock (lock_lock)
            {
                if (_isInitialized)
                {
                    throw new InvalidOperationException("Попытка перезаписать ключ");
                }

                if (string.IsNullOrWhiteSpace(key))
                {
                    throw new ArgumentException("Пустой ключ шифрования");
                }

                encryptionKey = Encoding.UTF8.GetBytes(key.PadRight(32)[..32]);
                _isInitialized = true;
            }
        }

        public static string Encrypt(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            if (!_isInitialized || encryptionKey == null)
            {
                throw new InvalidOperationException("EncryptionKey еще не инициализирован");
            }

            using (Aes aes = Aes.Create())
            {
                aes.Key = encryptionKey;
                // теперь в aes.IV не присваиваю массив нулей

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    memoryStream.Write(aes.IV, 0, aes.IV.Length);

                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter(cryptoStream))
                        {
                            streamWriter.Write(text);
                        }
                    }

                    byte[] array = memoryStream.ToArray();
                    return Convert.ToBase64String(array);
                }
            }
        }

        public static string Decrypt(string text)
        {
            if (string.IsNullOrEmpty(text)) return string.Empty;

            if (!_isInitialized || encryptionKey == null)
            {
                throw new InvalidOperationException("EncryptionKey еще не инициализирован");
            }

            try
            {
                byte[] full_text = Convert.FromBase64String(text);

                using (Aes aes = Aes.Create())
                {
                    aes.Key = encryptionKey;

                    // массив из 16 рандомных байт
                    byte[] iv = new byte[16];
                    byte[] text_bytes = new byte[full_text.Length - 16];

                    Buffer.BlockCopy(full_text, 0, iv, 0, 16);
                    Buffer.BlockCopy(full_text, 16, text_bytes, 0, text_bytes.Length);

                    aes.IV = iv;

                    ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                    using (MemoryStream memoryStream = new MemoryStream(text_bytes))
                    {
                        using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader streamReader = new StreamReader(cryptoStream))
                            {
                                return streamReader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
