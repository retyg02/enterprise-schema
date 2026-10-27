using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models;

public class Access
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Необходимо выбрать тип доступа из справочника")]
    public int AccessTypeId { get; set; }

    public virtual AccessTypeDict? AccessType { get; set; }

    [Required(ErrorMessage = "Сетевой адрес (IP/домен) обязателен для заполнения")]
    [StringLength(255, ErrorMessage = "Адрес не может превышать 255 символов")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "Порт обязателен для заполнения")]
    [Range(1, 65535, ErrorMessage = "Порт должен быть в диапазоне от 1 до 65535")]
    public int Port { get; set; }

    [Required(ErrorMessage = "Логин обязателен для заполнения")]
    [StringLength(50, ErrorMessage = "Логин не может быть длиннее 50 символов")]
    public string Login { get; set; } = string.Empty;

    [Required(ErrorMessage = "Пароль обязателен для заполнения")]
    [StringLength(255, ErrorMessage = "Зашифрованный пароль превышает допустимый лимит базы данных")]
    public string Pass { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Примечание не может быть длиннее 500 символов")]
    public string? Note { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.Now;

    public int? HostId { get; set; }
    public virtual Host? Host { get; set; }

    //public int? EnterpriseId { get; set; }
    //public virtual Enterprise? Enterprise { get; set; }
}
