namespace EnterpriseSchema.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Pass { get; set; } = string.Empty;
    }
}
