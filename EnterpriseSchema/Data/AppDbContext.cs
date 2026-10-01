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
        }
        public DbSet<Models.Host> Hosts { get; set; }
        public DbSet<Enterprise> Enterprises { get; set; }
        public DbSet<Access> Accesses { get; set; }
    }
}
