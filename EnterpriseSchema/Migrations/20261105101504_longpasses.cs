using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class longpasses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Pass", "UpdatedAtUtc" },
                values: new object[] { "7bEYaKlXi+jQKzOA33LsrptJR1ivDxmJHHMx+J+v+p63bI0LRfOLwFZWkWSYonus", new DateTime(2026, 11, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(7978) });

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Pass", "UpdatedAtUtc" },
                values: new object[] { "sdXT7lVlkR4M0eVAVte0ggCVF4mYISPs6TtbEUkhe0gIXUNUN/sfckz2P6IqZ3PK", new DateTime(2026, 11, 5, 10, 15, 3, 889, DateTimeKind.Utc).AddTicks(2313) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 8, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(2806), new DateTime(2026, 11, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(1438) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 11, 4, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(3237), new DateTime(2026, 11, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(3234) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 9, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(6817), new DateTime(2026, 11, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(4324) });

            migrationBuilder.UpdateData(
                table: "Hosts",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 10, 31, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(7106), new DateTime(2026, 11, 5, 10, 15, 3, 886, DateTimeKind.Utc).AddTicks(7103) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Pass",
                value: "AQAAAAIAAYagAAAAEEnuq6Y+R6GNnCv3YYnxMS6nECvbBVDSb3DCgWsljIANxdrm247b6Mh9hpYMPheBwQ==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Pass", "UpdatedAtUtc" },
                values: new object[] { "/lRxrxhBjAA8xB8Hru6kuA==", new DateTime(2026, 10, 30, 14, 34, 12, 415, DateTimeKind.Utc).AddTicks(4498) });

            migrationBuilder.UpdateData(
                table: "Accesses",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Pass", "UpdatedAtUtc" },
                values: new object[] { "579peqYad4xZUbKwgDrEwg==", new DateTime(2026, 10, 30, 14, 34, 12, 418, DateTimeKind.Utc).AddTicks(3525) });

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
    }
}
