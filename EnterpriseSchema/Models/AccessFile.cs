

namespace EnterpriseSchema.Models
{
    public class AccessFile
    {
        public int Id { get; set; }

        public int AccessId { get; set; }
        public Access Access { get; set; } = new();

        public string FileName { get; set; } = string.Empty;

        public string StoredFileName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
