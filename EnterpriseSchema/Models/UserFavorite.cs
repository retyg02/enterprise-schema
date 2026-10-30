using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EnterpriseSchema.Models
{
    public class UserFavorite
    {
        [Key]
        public int Id { get; set; }

        // теперь int
        [Required]
        public int UserId { get; set; }


        // добавил
        [Required]
        public int EnterpriseId { get; set; }

        // убрал атрибут Foreign Key чтоб стилистически одинаково было все
        public virtual Enterprise? Enterprise { get; set; }
    }
}
