namespace EnterpriseSchema.Models
{
    public class Host
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Ip { get; set; } = string.Empty;
        public string Os { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public Enterprise? Enterprise { get; set; }
        public ICollection<Access> Accesses { get; set; } = new List<Access>();

    }
}
