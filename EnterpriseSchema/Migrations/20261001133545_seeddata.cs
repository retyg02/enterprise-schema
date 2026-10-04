using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EnterpriseSchema.Migrations
{
    /// <inheritdoc />
    public partial class seeddata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Enterprises",
                columns: new[] { "Id", "City", "Contact", "Name", "Note" },
                values: new object[,]
                {
                    { 1, "Курган", "Иванов Иван Иванович", "Завод1", "Заметка1" },
                    { 2, "Челябинск", "Петров Петр Петрович", "Завод2", "Заметка2" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Enterprises",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
