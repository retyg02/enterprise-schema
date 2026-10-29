using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class filedatadownload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccessFiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AccessId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StoredFileName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AccessFiles_Accesses_AccessId",
                        column: x => x.AccessId,
                        principalTable: "Accesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1,
                column: "UpdatedAt",
                value: new DateTime(2026, 10, 29, 20, 11, 44, 329, DateTimeKind.Local).AddTicks(6468));

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2,
                column: "UpdatedAt",
                value: new DateTime(2026, 10, 29, 20, 11, 44, 332, DateTimeKind.Local).AddTicks(1745));

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 29, 15, 11, 44, 329, DateTimeKind.Utc).AddTicks(803), new DateTime(2026, 10, 29, 20, 11, 44, 327, DateTimeKind.Local).AddTicks(6436) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 10, 28, 15, 11, 44, 329, DateTimeKind.Utc).AddTicks(1322), new DateTime(2026, 10, 29, 20, 11, 44, 329, DateTimeKind.Local).AddTicks(1308) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 29, 15, 11, 44, 329, DateTimeKind.Utc).AddTicks(5236), new DateTime(2026, 10, 29, 20, 11, 44, 329, DateTimeKind.Local).AddTicks(2513) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 10, 24, 15, 11, 44, 329, DateTimeKind.Utc).AddTicks(5539), new DateTime(2026, 10, 29, 20, 11, 44, 329, DateTimeKind.Local).AddTicks(5534) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Pass",
                value: "AQAAAAIAAYagAAAAEF9et+AsCWOyH7kQ137b2e4E9W/BKETE47XGwcWSt5QVxckwPVIP9omdgTOW9lMwWA==");

            migrationBuilder.CreateIndex(
                name: "IX_AccessFiles_AccessId",
                table: "AccessFiles",
                column: "AccessId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessFiles");

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1,
                column: "UpdatedAt",
                value: new DateTime(2026, 10, 24, 16, 57, 34, 475, DateTimeKind.Local).AddTicks(9136));

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2,
                column: "UpdatedAt",
                value: new DateTime(2026, 10, 24, 16, 57, 34, 478, DateTimeKind.Local).AddTicks(3958));

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 7, 24, 11, 57, 34, 475, DateTimeKind.Utc).AddTicks(3874), new DateTime(2026, 10, 24, 16, 57, 34, 473, DateTimeKind.Local).AddTicks(9427) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 10, 23, 11, 57, 34, 475, DateTimeKind.Utc).AddTicks(4293), new DateTime(2026, 10, 24, 16, 57, 34, 475, DateTimeKind.Local).AddTicks(4280) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 8, 24, 11, 57, 34, 475, DateTimeKind.Utc).AddTicks(8046), new DateTime(2026, 10, 24, 16, 57, 34, 475, DateTimeKind.Local).AddTicks(5503) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 10, 19, 11, 57, 34, 475, DateTimeKind.Utc).AddTicks(8345), new DateTime(2026, 10, 24, 16, 57, 34, 475, DateTimeKind.Local).AddTicks(8339) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Pass",
                value: "AQAAAAIAAYagAAAAEC1pXobZl2WvMxG9jUNAbDOTl8/HIeY8Ked6a23qCS4i86evRJBtlvnZiiaTbjIJxQ==");
        }
    }
}
