using EnterpriseSchema.Models;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseSchema.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User 
                { 
                    Id = 1, 
                    Name = "Владимир Дмитриевич", 
                    Login = "login", 
                    Pass = "pass" 
                }
            );

            modelBuilder.Entity<Enterprise>().HasData(
                new Enterprise
                {
                    Id = 1,
                    Name = "Завод1",
                    City = "Курган",
                    Contact = "Иванов Иван Иванович",
                    Note = "Заметка1"
                },
                new Enterprise
                {
                    Id = 2,
                    Name = "Завод2",
                    City = "Челябинск",
                    Contact = "Петров Петр Петрович",
                    Note = "Заметка2"
                }
            );

            modelBuilder.Entity<Models.Host>().HasData(            
                new Models.Host
                {
                    Id = 1,
                    Name = "Сервер1",
                    Ip = "192.168.0.1",
                    Os = "Ubuntu 22 LTS",
                    Target = "СЦ (BluePyramid)",
                    NetworkInterfaces = "IfConfig output",
                    ServicesInfo = "Службы",
                    Notes = "Свободное поле",
                    EnterpriseId = 1
                },
                new Models.Host
                {
                    Id = 2,
                    Name = "Сервер2",
                    Ip = "192.168.0.2",
                    Os = "Debian 12",
                    Target = "СВ (Веб интерфейс)",
                    NetworkInterfaces = "IfConfig output",
                    ServicesInfo = "Службы",
                    Notes = "Свободное поле",
                    EnterpriseId = 1
                }
            );

            modelBuilder.Entity<Access>().HasData(                
                new Access
                {
                    Id = 1,
                    Type = "VPN",
                    Address = "vpn.stacklabs.ru",
                    Port = 1111,
                    Login = "login",
                    Pass = "pass",
                    ConfigContent = "Пути к развернутым службам",
                    Note = "Заметка1",
                    EnterpriseId = 1,
                    HostId = null
                },
                new Access
                {
                    Id = 2,
                    Type = "SSH",
                    Address = "192.168.0.10",
                    Port = 22,
                    Login = "root",
                    Pass = "pass",
                    ConfigContent = "Пути к развернутым службам",
                    Note = "Заметка2",
                    EnterpriseId = null,
                    HostId = 1
                },
                new Access
                {
                    Id = 3,
                    Type = "DB",
                    Address = "192.168.0.20",
                    Port = 3306,
                    Login = "root",
                    Pass = "pass",
                    ConfigContent = "Пути к развернутым службам",
                    Note = "Заметка3",
                    EnterpriseId = null,
                    HostId = 1
                }
            );
        }
        public DbSet<Models.Host> Hosts { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }
        public DbSet<Access> Accesses { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
