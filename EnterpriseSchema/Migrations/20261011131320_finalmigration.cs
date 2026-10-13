using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class finalmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AccessTypeDictionaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessTypeDictionaries", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CityDictionaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CityDictionaries", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Login = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pass = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Enterprises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CityId = table.Column<int>(type: "int", nullable: false),
                    Contact = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enterprises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Enterprises_CityDictionaries_CityId",
                        column: x => x.CityId,
                        principalTable: "CityDictionaries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Accesses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AccessTypeId = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Port = table.Column<int>(type: "int", nullable: false),
                    Login = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pass = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HostId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Accesses_AccessTypeDictionaries_AccessTypeId",
                        column: x => x.AccessTypeId,
                        principalTable: "AccessTypeDictionaries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Hosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Ip = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Purpose = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OsName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OsVer = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OsType = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NetworkInterfaces = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EnterpriseId = table.Column<int>(type: "int", nullable: false),
                    ServiceDictId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Hosts_Enterprises_EnterpriseId",
                        column: x => x.EnterpriseId,
                        principalTable: "Enterprises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ServiceDictionaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Path = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    HostId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceDictionaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceDictionaries_Hosts_HostId",
                        column: x => x.HostId,
                        principalTable: "Hosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "AccessTypeDictionaries",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "SSH" },
                    { 2, "Database" },
                    { 3, "VPN" }
                });

            migrationBuilder.InsertData(
                table: "CityDictionaries",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Курган" },
                    { 2, "Челябинск" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Login", "Name", "Pass" },
                values: new object[] { 1, "login", "User", "AQAAAAIAAYagAAAAEI61s+YzMYlOYq2SVjb2c3olzJeSALVIxv8m51SOlCBH96rdPMUBKKcjunL76Kmg8g==" });

            migrationBuilder.InsertData(
                table: "Enterprises",
                columns: new[] { "Id", "CityId", "Contact", "Name", "Note" },
                values: new object[,]
                {
                    { 1, 1, "Иванов Иван Иванович", "Завод1", "Заметка1" },
                    { 2, 2, "Петров Петр Петрович", "Завод2", "Заметка2" }
                });

            migrationBuilder.InsertData(
                table: "Hosts",
                columns: new[] { "Id", "EnterpriseId", "Ip", "Name", "NetworkInterfaces", "Notes", "OsName", "OsType", "OsVer", "Purpose", "ServiceDictId" },
                values: new object[,]
                {
                    { 1, 1, "192.168.0.1", "Сервер1", "IfConfig output", "Свободное поле", "Ubuntu", "04", "22", "СЦ", null },
                    { 2, 2, "192.168.0.2", "Сервер2", "ipconfig output", "Свободное поле", "Debian", "Bullseye", "12", "ВС", null }
                });

            migrationBuilder.InsertData(
                table: "Accesses",
                columns: new[] { "Id", "AccessTypeId", "Address", "HostId", "Login", "Note", "Pass", "Port" },
                values: new object[,]
                {
                    { 1, 1, "192.168.0.1", 1, "root", "Доступ к терминалу", "/lRxrxhBjAA8xB8Hru6kuA==", 22 },
                    { 2, 2, "192.168.0.2", 2, "db_admin", "Доступ к MySQL", "579peqYad4xZUbKwgDrEwg==", 3306 }
                });

            migrationBuilder.InsertData(
                table: "ServiceDictionaries",
                columns: new[] { "Id", "Description", "HostId", "Name", "Path" },
                values: new object[,]
                {
                    { 1, "Мониторинг", 1, "Zabbix Agent", "/usr/bin/zbx" },
                    { 2, "СУБД", 1, "MySQL Server", "/var/lib/mysql" },
                    { 3, "Веб-сервер", 1, "Nginx Web Server", "/etc/nginx" },
                    { 4, "Резервный веб", 2, "Apache", "/etc/httpd" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accesses_AccessTypeId",
                table: "Accesses",
                column: "AccessTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Accesses_HostId",
                table: "Accesses",
                column: "HostId");

            migrationBuilder.CreateIndex(
                name: "IX_Enterprises_CityId",
                table: "Enterprises",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Hosts_EnterpriseId",
                table: "Hosts",
                column: "EnterpriseId");

            migrationBuilder.CreateIndex(
                name: "IX_Hosts_ServiceDictId",
                table: "Hosts",
                column: "ServiceDictId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceDictionaries_HostId",
                table: "ServiceDictionaries",
                column: "HostId");

            migrationBuilder.AddForeignKey(
                name: "FK_Accesses_Hosts_HostId",
                table: "Accesses",
                column: "HostId",
                principalTable: "Hosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hosts_ServiceDictionaries_ServiceDictId",
                table: "Hosts",
                column: "ServiceDictId",
                principalTable: "ServiceDictionaries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceDictionaries_Hosts_HostId",
                table: "ServiceDictionaries");

            migrationBuilder.DropTable(
                name: "Accesses");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "AccessTypeDictionaries");

            migrationBuilder.DropTable(
                name: "Hosts");

            migrationBuilder.DropTable(
                name: "Enterprises");

            migrationBuilder.DropTable(
                name: "ServiceDictionaries");

            migrationBuilder.DropTable(
                name: "CityDictionaries");
        }
    }
}
