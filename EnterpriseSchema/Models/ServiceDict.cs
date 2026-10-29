using System.ComponentModel.DataAnnotations;

namespace EnterpriseSchema.Models
{
    public class ServiceDict
    {
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength (200)]
        public string Path { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
        public int HostId { get; set; }
        public virtual Host? Host { get; set; }

        public virtual ICollection<Host> Hosts { get; set; } = new List<Host>();
    }
}
