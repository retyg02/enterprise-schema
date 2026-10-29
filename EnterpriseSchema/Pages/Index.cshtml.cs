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
using Microsoft.AspNetCore.Identity;

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
        public IList<Models.Host>? HostsModel { get; set; }
        public IList<Access>? Accesses { get; set; }

        public List<int> UserFavoriteEnterpriseIds { get; set; } = new List<int>();


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


        public async Task<JsonResult> OnPostToggleFavoriteAsync(int enterpriseId)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return new JsonResult(new { success = false, message = "Пользователь не авторизован" });
            }

            try
            {
                var existingFavorite = await _context.UserFavorites
                    .AsNoTracking()
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.EnterpriseId == enterpriseId);

                bool isFavoriteNow = false;

                if (existingFavorite != null)
                {
                    var favToDelete = new UserFavorite { Id = existingFavorite.Id };
                    _context.Entry(favToDelete).State = EntityState.Deleted;
                }
                else
                {
                    bool alreadyExists = await _context.UserFavorites
                        .AnyAsync(f => f.UserId == userId && f.EnterpriseId == enterpriseId);

                    if (!alreadyExists)
                    {
                        var newFavorite = new UserFavorite
                        {
                            UserId = userId,
                            EnterpriseId = enterpriseId
                        };
                        await _context.UserFavorites.AddAsync(newFavorite);
                        isFavoriteNow = true;
                    }
                }

                await _context.SaveChangesAsync();
                return new JsonResult(new { success = true, isFavorite = isFavoriteNow });
            }
            catch (DbUpdateConcurrencyException)
            {
                var currentStatus = await _context.UserFavorites
                    .AnyAsync(f => f.UserId == userId && f.EnterpriseId == enterpriseId);

                return new JsonResult(new { success = true, isFavorite = currentStatus });
            }
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
                    if (data.TryGetProperty("contactPhone", out var contactPhoneProp)) enterprise.ContactPhone = contactPhoneProp.GetString() ?? string.Empty;
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

                    await LogActionAsync("Enterprise", enterprise.Id, "Create", $"Создано предприятие «{enterprise.Name}»", enterprise.Id);
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
                    .ThenInclude(h => h.Accesses)
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


            


            if (_context.Accesses != null)
            {
                Accesses = await _context.Accesses
                    .Include(a => a.AccessType)
                    .ToListAsync();
            }
            if (_context.Hosts != null)
            {
                HostsModel = await _context.Hosts
                    .ToListAsync();
            }

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                UserFavoriteEnterpriseIds = await _context.UserFavorites
                    .Where(f => f.UserId == userId)
                    .Select(f => f.EnterpriseId)
                    .ToListAsync();
            }
            else
            {
                UserFavoriteEnterpriseIds = new List<int>();
            }

        }

        public async Task<IActionResult> OnPostDeleteAsync(int id)
        {
            if (_context.Enterprises != null)
            {
                var enterprise = await _context.Enterprises.FindAsync(id);
                if (enterprise != null)
                {

                    if (_context.Hosts != null && _context.Accesses != null)
                    {
                        var dependentHosts = await _context.Hosts
                            .Where(h => h.EnterpriseId == id)
                            .ToListAsync();

                        if (dependentHosts != null)
                        {
                            foreach (var host in dependentHosts)
                            { 
                                var accessesDependent = await _context.Accesses
                                    .Where(a => a.HostId == host.Id)
                                    .ToListAsync();

                                if (!accessesDependent.Any())
                                {
                                    foreach (var accessHost in accessesDependent)
                                    {
                                        var accessType = await _context.AccessTypeDictionaries.FindAsync(accessHost.AccessTypeId);
                                        if (accessType != null)
                                        {
                                            var accessName = accessType.Name;

                                            await LogActionAsync("Access", accessHost.Id, "Delete", $"Удален доступ «{accessName}» из-за удаления предприятия {enterprise.Name}");
                                            _context.Accesses.Remove(accessHost);
                                        }
                                        
                                    }
                                }

                                await LogActionAsync("Host", host.Id, "Delete", $"Удален хост «{host.Name}» из-за удаления предприятия {enterprise.Name}");
                            }
                            
                        }
                    }
                    _context.Enterprises.Remove(enterprise);
                    await _context.SaveChangesAsync();

                    await LogActionAsync("Enterprise", enterprise.Id, "Delete", $"Удалено предприятие «{enterprise.Name}»", enterprise.Id);
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
                if (data.TryGetProperty("contactPhone", out var contactPhoneProp)) enterprise.ContactPhone = contactPhoneProp.GetString() ?? string.Empty;
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
                    dbEnterprise.ContactPhone = enterprise.ContactPhone;
                    dbEnterprise.Note = enterprise.Note;

                    _context.Entry(dbEnterprise).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                    await LogActionAsync("Enterprise", enterprise.Id, "Update", $"Обновлено предприятие «{enterprise.Name}»", enterprise.Id);
                    await _context.SaveChangesAsync();
                }
            }

            return new JsonResult(new { success = true });
        }


        private async Task LogActionAsync(string entityType, int entityId, string actionType, string description, int? enterpriseIdToUpdate = null, int? hostIdToUpdate = null, int? accessIdToUpdate = null)
        {
            var currentUserName = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value
                                  ?? User.Identity?.Name
                                  ?? "Система / Аноним";

            var logEntry = new AuditLog
            {
                UserId = currentUserName,
                EntityType = entityType,
                EntityId = entityId,
                ActionType = actionType,
                Description = description,
                Timestamp = DateTime.Now
            };

            await _context.AuditLogs.AddAsync(logEntry);

            
            if (enterpriseIdToUpdate.HasValue)
            {
                var enterprise = await _context.Enterprises.FindAsync(enterpriseIdToUpdate.Value);
                if (enterprise != null)
                {
                    enterprise.UpdatedAt = DateTime.Now;
                    _context.Entry(enterprise).State = EntityState.Modified;
                }
            }
            if (hostIdToUpdate.HasValue)
            {
                var host = await _context.Hosts.FindAsync(hostIdToUpdate.Value);
                if (host != null)
                {
                    host.UpdatedAt = DateTime.Now;
                    _context.Entry(host).State = EntityState.Modified;
                }
            }
            if (accessIdToUpdate.HasValue)
            {
                var access = await _context.Accesses.FindAsync(accessIdToUpdate.Value);
                if (access != null)
                {
                    access.UpdatedAt = DateTime.Now;
                    _context.Entry(access).State = EntityState.Modified;
                }
            }
        }



    }
}
