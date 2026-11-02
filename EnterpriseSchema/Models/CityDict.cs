using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models
{
    public class CityDict
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<Enterprise> Enterprises { get; set; } = new List<Enterprise>();
    }
}
