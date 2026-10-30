using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Имя пользователя не может быть пустым")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Имя должно быть от 2 до 50 символов")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Логин не может быть пустым")]
        [StringLength(100, MinimumLength = 7, ErrorMessage = "Логин должен быть от 2 до 50 символов")]
        public string Login { get; set; } = string.Empty;



        // это именно хеш, пароль пользователя в чистом виде нигде не хранится,
        // и раз хеш имеет всегда строго фиксированную длину, еще и генерируется програмно только,
        // значит атрибуты проверки длины реально бессмыслены, закомментировал
         

        [Required(ErrorMessage = "Пароль обязателен")]
        //[StringLength(255, ErrorMessage = "Хэш пароля превышает допустимый лимит")]
        public string Pass { get; set; } = string.Empty;
    }
}
