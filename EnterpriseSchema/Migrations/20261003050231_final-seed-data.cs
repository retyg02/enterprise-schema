using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class finalseeddata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accesses_Hosts_HostsId",
                table: "Accesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Hosts_Enterprises_EnterpriseId",
                table: "Hosts");

            migrationBuilder.RenameColumn(
                name: "HostsId",
                table: "Accesses",
                newName: "HostId");

            migrationBuilder.RenameIndex(
                name: "IX_Accesses_HostsId",
                table: "Accesses",
                newName: "IX_Accesses_HostId");

            migrationBuilder.AlterColumn<int>(
                name: "EnterpriseId",
                table: "Hosts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NetworkInterfaces",
                table: "Hosts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Hosts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ServicesInfo",
                table: "Hosts",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ConfigContent",
                table: "Accesses",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Login = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Pass = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Accesses",
                columns: new[] { "Id", "Address", "ConfigContent", "EnterpriseId", "HostId", "Login", "Note", "Pass", "Port", "Type" },
                values: new object[] { 1, "vpn.stacklabs.ru", "Пути к развернутым службам", 1, null, "login", "Заметка1", "pass", 1111, "VPN" });

            migrationBuilder.InsertData(
                table: "Hosts",
                columns: new[] { "Id", "EnterpriseId", "Ip", "Name", "NetworkInterfaces", "Notes", "Os", "ServicesInfo", "Target" },
                values: new object[,]
                {
                    { 1, 1, "192.168.0.1", "Сервер1", "IfConfig output", "Свободное поле", "Ubuntu 22 LTS", "Службы", "СЦ (BluePyramid)" },
                    { 2, 1, "192.168.0.2", "Сервер2", "IfConfig output", "Свободное поле", "Debian 12", "Службы", "СВ (Веб интерфейс)" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Login", "Name", "Pass" },
                values: new object[] { 1, "login", "Владимир Дмитриевич", "pass" });

            migrationBuilder.InsertData(
                table: "Accesses",
                columns: new[] { "Id", "Address", "ConfigContent", "EnterpriseId", "HostId", "Login", "Note", "Pass", "Port", "Type" },
                values: new object[,]
                {
                    { 2, "192.168.0.10", "Пути к развернутым службам", null, 1, "root", "Заметка2", "pass", 22, "SSH" },
                    { 3, "192.168.0.20", "Пути к развернутым службам", null, 1, "root", "Заметка3", "pass", 3306, "DB" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Accesses_Hosts_HostId",
                table: "Accesses",
                column: "HostId",
                principalTable: "Hosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hosts_Enterprises_EnterpriseId",
                table: "Hosts",
                column: "EnterpriseId",
                principalTable: "Enterprises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Accesses_Hosts_HostId",
                table: "Accesses");

            migrationBuilder.DropForeignKey(
                name: "FK_Hosts_Enterprises_EnterpriseId",
                table: "Hosts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DeleteData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "NetworkInterfaces",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "ServicesInfo",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "ConfigContent",
                table: "Accesses");

            migrationBuilder.RenameColumn(
                name: "HostId",
                table: "Accesses",
                newName: "HostsId");

            migrationBuilder.RenameIndex(
                name: "IX_Accesses_HostId",
                table: "Accesses",
                newName: "IX_Accesses_HostsId");

            migrationBuilder.AlterColumn<int>(
                name: "EnterpriseId",
                table: "Hosts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Accesses_Hosts_HostsId",
                table: "Accesses",
                column: "HostsId",
                principalTable: "Hosts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Hosts_Enterprises_EnterpriseId",
                table: "Hosts",
                column: "EnterpriseId",
                principalTable: "Enterprises",
                principalColumn: "Id");
        }
    }
}
