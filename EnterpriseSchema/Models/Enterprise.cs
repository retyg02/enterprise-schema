namespace EnterpriseSchema.Models
{
    public class Enterprise
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Contact { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public ICollection<Host> Hosts { get; set; } = new List<Host>();
        public ICollection<Access> Accesses { get; set; } = new List<Access>();
    }

}
