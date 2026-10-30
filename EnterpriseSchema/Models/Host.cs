using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models;

public class Host
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Имя хоста обязательно для заполнения")]
    [StringLength(100, ErrorMessage = "Имя хоста не может превышать 100 символов")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "IP-адрес обязателен для заполнения")]
    [RegularExpression(@"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
        ErrorMessage = "Некорректный формат IPv4-адреса")]
    public string Ip { get; set; } = string.Empty;

    [Required(ErrorMessage = "Необходимо указать назначение хоста")]
    public string Purpose { get; set; } = string.Empty;

    [Required(ErrorMessage = "Название ОС обязательно")]
    [StringLength(50)]
    public string OsName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Версия ОС обязательна")]
    [StringLength(30)]
    public string OsVer { get; set; } = string.Empty;

    [Required(ErrorMessage = "Тип  ОС обязателен")]
    [StringLength(30)]
    public string OsType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Информация о сетевых интерфейсах обязательна")]
    public string NetworkInterfaces { get; set; } = string.Empty;

    public virtual ICollection<ServiceDict> Services { get; set; } = new List<ServiceDict>();

    [StringLength(500, ErrorMessage = "Заметка не может превышать 500 символов")]
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.Now;


    public int EnterpriseId { get; set; }
    public virtual Enterprise? Enterprise { get; set; }
    public virtual ICollection<Access> Accesses { get; set; } = new List<Access>();
}
