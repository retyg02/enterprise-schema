using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogsAndUpdatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Hosts",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Enterprises",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Accesses",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EntityType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EntityId = table.Column<int>(type: "int", nullable: false),
                    ActionType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1,
                column: "UpdatedAt",
                value: new DateTime(2026, 10, 24, 15, 12, 24, 743, DateTimeKind.Local).AddTicks(9742));

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2,
                column: "UpdatedAt",
                value: new DateTime(2026, 10, 24, 15, 12, 24, 746, DateTimeKind.Local).AddTicks(6601));

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 24, 10, 12, 24, 743, DateTimeKind.Utc).AddTicks(4391), new DateTime(2026, 10, 24, 15, 12, 24, 741, DateTimeKind.Local).AddTicks(8676) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 10, 23, 10, 12, 24, 743, DateTimeKind.Utc).AddTicks(4829), new DateTime(2026, 10, 24, 15, 12, 24, 743, DateTimeKind.Local).AddTicks(4815) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 24, 10, 12, 24, 743, DateTimeKind.Utc).AddTicks(8659), new DateTime(2026, 10, 24, 15, 12, 24, 743, DateTimeKind.Local).AddTicks(6045) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 10, 19, 10, 12, 24, 743, DateTimeKind.Utc).AddTicks(8955), new DateTime(2026, 10, 24, 15, 12, 24, 743, DateTimeKind.Local).AddTicks(8950) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Pass",
                value: "AQAAAAIAAYagAAAAEKUhUZ/tD8paDOD7rkVx2gvCqrhUT+FKQxwT2BJa4p90/SJhUzAPHjzrIoPgpAv2cw==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Hosts");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Enterprises");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Accesses");

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 23, 15, 25, 7, 827, DateTimeKind.Utc).AddTicks(7399));

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 22, 15, 25, 7, 827, DateTimeKind.Utc).AddTicks(7835));

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 8, 23, 15, 25, 7, 828, DateTimeKind.Utc).AddTicks(1399));

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 10, 18, 15, 25, 7, 828, DateTimeKind.Utc).AddTicks(1691));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Pass",
                value: "AQAAAAIAAYagAAAAEJcvooDnZGW4zLxcD47sXxJj5c63Y6wZA8NvbUdu0SC4n7jtio1GCaLjWijNDMYF1A==");
        }
    }
}
