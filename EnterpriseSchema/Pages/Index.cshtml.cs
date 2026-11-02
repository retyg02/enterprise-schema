using EnterpriseSchema.Data;
using EnterpriseSchema.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace EnterpriseSchema.Pages
{
    public class IndexModel : PageModel
    {
        private readonly AppDbContext _context;
        public IndexModel(AppDbContext context)
        {
            _context = context;
        }
        public IList<Enterprise>? Enterprises { get; set; }

        //[BindProperty]
        //public Enterprise? NewEnterprise { get; set; }

        //[BindProperty]
        //public Enterprise? UpdateEnterprise { get; set; }

        public SelectList? CityList { get; set; }
        public async Task OnGetAsync(string? searchString)
        {
            ViewData["CurrentFilter"] = searchString;
            await LoadPageDataAsync(searchString);
        }

        public async Task<IActionResult> OnPostLogoutAsync()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToPage("/Login");
        }


        public async Task<IActionResult> OnPostCreateCityAsync([FromBody] string newCityName)
        {
            if (string.IsNullOrWhiteSpace(newCityName) || _context.CityDictionaries == null)
            {
                return BadRequest(new { error = "Имя города не может быть пустым" });
            }

            var existingCity = await _context.CityDictionaries
                .FirstOrDefaultAsync(c => c.Name.ToLower() == newCityName.ToLower());

            if (existingCity != null)
            {
                return new JsonResult(new { id = existingCity.Id, name = existingCity.Name });
            }

            var city = new CityDict { Name = newCityName };
            _context.CityDictionaries.Add(city);
            await _context.SaveChangesAsync(); 

            return new JsonResult(new { id = city.Id, name = city.Name });
        }


        

        public async Task<IActionResult> OnPostCreateAsync([FromBody] JsonElement data)
        {
               
                var enterprise = new Enterprise();

                try
                {
                    
                    if (data.TryGetProperty("name", out var nameProp)) enterprise.Name = nameProp.GetString() ?? string.Empty;
                    if (data.TryGetProperty("cityId", out var cityProp)) enterprise.CityId = cityProp.GetInt32();
                    if (data.TryGetProperty("contact", out var contactProp)) enterprise.Contact = contactProp.GetString() ?? string.Empty;
                    if (data.TryGetProperty("note", out var noteProp)) enterprise.Note = noteProp.GetString();
                }
                catch
                {
                    return BadRequest(new { errors = new List<string> { "Некорректный формат переданных данных" } });
                }

                var validationContext = new ValidationContext(enterprise);
                var validationResults = new List<ValidationResult>();

                if (!Validator.TryValidateObject(enterprise, validationContext, validationResults, true))
                {
                    
                    var errors = validationResults.Select(r => r.ErrorMessage ?? "Ошибка валидации").ToList();
                    return BadRequest(new { errors = errors });
                }

                if (_context.Enterprises != null)
                {
                    _context.Enterprises.Add(enterprise);
                    await _context.SaveChangesAsync();
                }

                return new JsonResult(new { success = true });
        }



        private async Task LoadPageDataAsync(string? searchString = null)
        {
            if (_context.Enterprises == null) return;

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                string search = searchString.Trim().ToLower();

                Enterprises = await _context.Enterprises
                    .Include(e => e.City)
                    .Include(e => e.Hosts)
                    .Where(e => e.Name.ToLower().Contains(search) || e.Hosts.Any(h => h.Name.ToLower().Contains(search) || h.Ip.Contains(search)))
                    .ToListAsync();
            }
            else
            {
                Enterprises = await _context.Enterprises
                    .Include(e => e.City)
                    .Include(e => e.Hosts)
                    .ToListAsync();
            }

            if (_context.CityDictionaries != null)
            {
                var cities = await _context.CityDictionaries.OrderBy(c => c.Name).ToListAsync();
                CityList = new SelectList(cities, "Id", "Name");
            }
        }

        public async Task<IActionResult> OnPostDeleteAsync(int id)
        {
            if (_context.Enterprises != null)
            {
                var enterprise = await _context.Enterprises.FindAsync(id);
                if (enterprise != null)
                {
                    _context.Enterprises.Remove(enterprise);
                    await _context.SaveChangesAsync();
                }
            }
            return RedirectToPage("/Index");
        }

        public async Task<IActionResult> OnPostUpdateAsync([FromBody] JsonElement data)
        {
            var enterprise = new Enterprise();
            int id = 0;

            try
            {
                if (data.TryGetProperty("id", out var idProp)) id = idProp.GetInt32();
                if (data.TryGetProperty("name", out var nameProp)) enterprise.Name = nameProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("cityId", out var cityProp)) enterprise.CityId = cityProp.GetInt32();
                if (data.TryGetProperty("contact", out var contactProp)) enterprise.Contact = contactProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("note", out var noteProp)) enterprise.Note = noteProp.GetString();
            }
            catch
            {
                return BadRequest(new { errors = new List<string> { "Некорректный формат данных при обновлении" } });
            }

            var validationContext = new ValidationContext(enterprise);
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(enterprise, validationContext, validationResults, true))
            {
                var errors = validationResults.Select(r => r.ErrorMessage ?? "Ошибка").ToList();
                return BadRequest(new { errors = errors });
            }

            if (_context.Enterprises != null)
            {
                var dbEnterprise = await _context.Enterprises.FindAsync(id);
                if (dbEnterprise != null)
                {
                    dbEnterprise.Name = enterprise.Name;
                    dbEnterprise.CityId = enterprise.CityId;
                    dbEnterprise.Contact = enterprise.Contact;
                    dbEnterprise.Note = enterprise.Note;

                    _context.Entry(dbEnterprise).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }
            }

            return new JsonResult(new { success = true });
        }

    }
}
