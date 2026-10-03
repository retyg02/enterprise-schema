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
        public string ConfigContent { get; set; } = string.Empty;

        public int? HostId { get; set; }
        public Host? Hosts { get; set; }
        public int? EnterpriseId { get; set; }
        public Enterprise? Enterprise { get; set; }
    }
}
