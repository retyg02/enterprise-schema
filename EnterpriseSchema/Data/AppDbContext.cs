using EnterpriseSchema.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

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

            modelBuilder.Entity<Models.Host>()
                .HasMany(h => h.Services)
                .WithOne(s => s.Host)
                .HasForeignKey(s => s.HostId)
                .OnDelete(DeleteBehavior.Cascade);

            var hasher = new PasswordHasher<User>();

            var admin = new User
            {
                Id = 1,
                Name = "User",
                Login = "login"
            };

            admin.Pass = hasher.HashPassword(admin, "pass");
            modelBuilder.Entity<User>().HasData(admin);

            modelBuilder.Entity<CityDict>().HasData(
                new CityDict { Id = 1, Name = "Курган" },
                new CityDict { Id = 2, Name = "Челябинск" }
            );

            modelBuilder.Entity<AccessTypeDict>().HasData(
                new AccessTypeDict { Id = 1, Name = "SSH" },
                new AccessTypeDict { Id = 2, Name = "Database" },
                new AccessTypeDict { Id = 3, Name = "VPN" }
            );

            modelBuilder.Entity<ServiceDict>().HasData(
                new ServiceDict { Id = 1, Name = "Zabbix Agent", Description = "Мониторинг", Path = "/usr/bin/zbx", HostId = 1 },
                new ServiceDict { Id = 2, Name = "MySQL Server", Description = "СУБД", Path = "/var/lib/mysql", HostId = 1 },
                new ServiceDict { Id = 3, Name = "Nginx Web Server", Description = "Веб-сервер", Path = "/etc/nginx", HostId = 1 },
        
                new ServiceDict { Id = 4, Name = "Apache", Description = "Резервный веб", Path = "/etc/httpd", HostId = 2 }
);

            modelBuilder.Entity<Enterprise>().HasData(
                new Enterprise
                {
                    Id = 1,
                    Name = "Завод1",
                    CityId = 1, 
                    Contact = "Иванов Иван Иванович",
                    Note = "Заметка1",
                    CreatedAtUtc = DateTime.UtcNow.AddMonths(-3)
                },
                new Enterprise
                {
                    Id = 2,
                    Name = "Завод2",
                    CityId = 2, 
                    Contact = "Петров Петр Петрович",
                    Note = "Заметка2",
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-1)
                }
            );

            modelBuilder.Entity<Models.Host>().HasData(
                new Models.Host
                {
                    Id = 1,
                    Name = "Сервер1",
                    Ip = "192.168.0.1",
                    OsName = "Ubuntu",
                    OsVer = "22",
                    OsType = "04",
                    Purpose = "СЦ",
                    NetworkInterfaces = "IfConfig output",
                    Notes = "Свободное поле",
                    EnterpriseId = 1,
                    CreatedAtUtc = DateTime.UtcNow.AddMonths(-2)
                },
                new Models.Host
                {
                    Id = 2,
                    Name = "Сервер2",
                    Ip = "192.168.0.2",
                    OsName = "Debian",
                    OsVer = "12",
                    OsType = "Bullseye",
                    Purpose = "ВС",
                    NetworkInterfaces = "ipconfig output",
                    Notes = "Свободное поле",
                    EnterpriseId = 2,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-5)
                }
            );

            modelBuilder.Entity<Access>().HasData(
                new Access
                {
                    Id = 1,
                    AccessTypeId = 1,
                    Address = "192.168.0.1",
                    Port = 22,
                    Login = "root",
                    Pass = CryptoHelper.Encrypt("pass"),
                    Note = "Доступ к терминалу",
                    HostId = 1,
                    //EnterpriseId = 1
                },
                new Access
                {
                    Id = 2,
                    AccessTypeId = 2,
                    Address = "192.168.0.2",
                    Port = 3306,
                    Login = "db_admin",
                    Pass = CryptoHelper.Encrypt("mysql_pass"),
                    Note = "Доступ к MySQL",
                    HostId = 2,
                    //EnterpriseId = 2
                }
            );
        }
        public DbSet<Models.Host> Hosts { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }
        public DbSet<Access> Accesses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserFavorite> UserFavorites { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        public DbSet<CityDict> CityDictionaries { get; set; }
        public DbSet<AccessTypeDict> AccessTypeDictionaries { get; set; }
        public DbSet<ServiceDict> ServiceDictionaries { get; set; }



        public DbSet<AccessFile> AccessFiles { get; set; }

    }
}
