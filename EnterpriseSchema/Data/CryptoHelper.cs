using System.Security.Cryptography;
using System.Text;

namespace EnterpriseSchema.Data;

public static class CryptoHelper
{
    public static string EncryptionKey { get; set; } = string.Empty;

    public static string Encrypt(string Text)
    {
        if (string.IsNullOrEmpty(Text)) return string.Empty;

        byte[] iv = new byte[16];
        byte[] array;

        using Aes aes = Aes.Create();
        
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32)[..32]);
            aes.IV = iv;

            ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

            using MemoryStream memoryStream = new();            
                using CryptoStream cryptoStream = new(memoryStream, encryptor, CryptoStreamMode.Write);                
                    using (StreamWriter streamWriter = new(cryptoStream))
                    {
                        streamWriter.Write(Text);
                    }
                    array = memoryStream.ToArray();
                
            
        

        return Convert.ToBase64String(array);
    }

    public static string Decrypt(string Text)
    {
        if (string.IsNullOrEmpty(Text)) return string.Empty;

        byte[] iv = new byte[16];
        byte[] array = Text.Contains(' ') ? Convert.FromBase64String(Text.Replace(' ', '+')) : Convert.FromBase64String(Text);

        using Aes aes = Aes.Create();
        
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey.PadRight(32)[..32]);
            aes.IV = iv;

            ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            using MemoryStream memoryStream = new(array);
                using CryptoStream cryptoStream = new(memoryStream, decryptor, CryptoStreamMode.Read);
                    using StreamReader streamReader = new(cryptoStream);                    
                        return streamReader.ReadToEnd();
                    
                
            
        
    }
}
