using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models
{
    public class AccessTypeDict
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        public virtual ICollection<Access> Accesses { get; set; } = new List<Access>();
    }
}
