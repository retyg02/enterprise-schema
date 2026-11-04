using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class contactphone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "Enterprises",
                type: "varchar(30)",
                maxLength: 30,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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
                columns: new[] { "ContactPhone", "CreatedAt", "UpdatedAt" },
                values: new object[] { null, new DateTime(2026, 7, 24, 11, 57, 34, 475, DateTimeKind.Utc).AddTicks(3874), new DateTime(2026, 10, 24, 16, 57, 34, 473, DateTimeKind.Local).AddTicks(9427) });

            migrationBuilder.UpdateData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "ContactPhone", "CreatedAt", "UpdatedAt" },
                values: new object[] { null, new DateTime(2026, 10, 23, 11, 57, 34, 475, DateTimeKind.Utc).AddTicks(4293), new DateTime(2026, 10, 24, 16, 57, 34, 475, DateTimeKind.Local).AddTicks(4280) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "Enterprises");

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
    }
}
