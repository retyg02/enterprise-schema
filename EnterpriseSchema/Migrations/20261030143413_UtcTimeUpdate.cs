using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class UtcTimeUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Hosts",
                newName: "UpdatedAtUtc");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Hosts",
                newName: "CreatedAtUtc");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Enterprises",
                newName: "UpdatedAtUtc");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Enterprises",
                newName: "CreatedAtUtc");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "Accesses",
                newName: "UpdatedAtUtc");

            migrationBuilder.AlterColumn<string>(
                name: "Pass",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldMaxLength: 255)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserFavorites",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1,
                column: "UpdatedAtUtc",
                value: new DateTime(2026, 10, 30, 14, 34, 12, 415, DateTimeKind.Utc).AddTicks(4498));

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2,
                column: "UpdatedAtUtc",
                value: new DateTime(2026, 10, 30, 14, 34, 12, 418, DateTimeKind.Utc).AddTicks(3525));

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 7, 30, 14, 34, 12, 414, DateTimeKind.Utc).AddTicks(8816), new DateTime(2026, 10, 30, 14, 34, 12, 414, DateTimeKind.Utc).AddTicks(7317) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 10, 29, 14, 34, 12, 414, DateTimeKind.Utc).AddTicks(9322), new DateTime(2026, 10, 30, 14, 34, 12, 414, DateTimeKind.Utc).AddTicks(9318) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 8, 30, 14, 34, 12, 415, DateTimeKind.Utc).AddTicks(3220), new DateTime(2026, 10, 30, 14, 34, 12, 415, DateTimeKind.Utc).AddTicks(494) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 10, 25, 14, 34, 12, 415, DateTimeKind.Utc).AddTicks(3531), new DateTime(2026, 10, 30, 14, 34, 12, 415, DateTimeKind.Utc).AddTicks(3528) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Pass",
                value: "AQAAAAIAAYagAAAAEPJ1ijI8+75G0AZzqDBQmcn5Zn8N+lLXkybu4F2HZupxLe311gEJJd8Tj+dwlL9arg==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedAtUtc",
                table: "Hosts",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "CreatedAtUtc",
                table: "Hosts",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "UpdatedAtUtc",
                table: "Enterprises",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "CreatedAtUtc",
                table: "Enterprises",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "UpdatedAtUtc",
                table: "Accesses",
                newName: "UpdatedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Pass",
                table: "Users",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserFavorites",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
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
        }
    }
}
