using EnterpriseSchema.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.FileProviders;


var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("Conn1");
var serverVersion = new MySqlServerVersion(new Version(8, 0, 0));

var aesKey = builder.Configuration["CryptoSettings:AesKey"];
if (string.IsNullOrWhiteSpace(aesKey)) throw new ArgumentNullException(nameof(aesKey), "Ошибка: Мастер-ключ отсутствует");
// сетер у private поля вместо присваивания
CryptoHelper.SetEncryptionKey(aesKey);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connString, serverVersion, mySqlOptions =>
        mySqlOptions.EnableRetryOnFailure(
        maxRetryCount: 5,
        maxRetryDelay: System.TimeSpan.FromSeconds(5),
        errorNumbersToAdd: null
        )
    ));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    });

builder.Services.AddRazorPages(options =>
{
    options.Conventions.AuthorizeFolder("/");
    options.Conventions.AllowAnonymousToPage("/Login");
});

var app = builder.Build();

using var scope = app.Services.CreateScope();
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();


var uploadsPath = Path.Combine(builder.Environment.WebRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});



app.Run();
