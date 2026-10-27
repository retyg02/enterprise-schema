using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnterpriseSchema.Models
{
    public class UserFavorite
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public int EnterpriseId { get; set; }

        [ForeignKey("EnterpriseId")]
        public virtual Enterprise? Enterprise { get; set; }
    }
}
