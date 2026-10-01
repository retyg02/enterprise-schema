namespace EnterpriseSchema.Models
{
    public class Access
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int Port { get; set;  }
        public string Login { get; set; } = string.Empty;
        public string Pass { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public Host? Hosts { get; set; }
        public Enterprise? Enterprise { get; set; }
    }
}
