using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models;

public class Enterprise
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Название предприятия обязательно для заполнения")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Название должно быть от 2 до 150 символов")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Необходимо выбрать город из справочника")]
    public int CityId { get; set; }

    public virtual CityDict? City { get; set; }

    [Required(ErrorMessage = "Контактные данные обязательны для заполнения")]
    [StringLength(100, ErrorMessage = "Длина контактных данных не может превышать 100 символов")]
    public string Contact { get; set; } = string.Empty;

    [StringLength(30)]
    public string? ContactPhone { get; set; }


    [StringLength(500, ErrorMessage = "Примечание не может быть длиннее 500 символов")]
    public string? Note { get; set; }

    // сделал utc время
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    // сделал utc время
    [Required]
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;



    public virtual ICollection<Host> Hosts { get; set; } = new List<Host>();
    //public virtual ICollection<Access> Accesses { get; set; } = new List<Access>();
}
