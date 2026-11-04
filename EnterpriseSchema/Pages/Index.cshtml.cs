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
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return new JsonResult(new { success = false, message = "Пользователь не авторизован или ID некорректен" });
            }


            try
            {
                var existingFavorite = await _context.UserFavorites
                    .AsNoTracking()
                    .FirstOrDefaultAsync(f => f.UserId == userId && 
                    f.EnterpriseId == enterpriseId);

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
               
                

                try
                {



                // десериализация через dto класс
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var dto = JsonSerializer.Deserialize<EnterpriseDto>(data.GetRawText(), options);

                if (dto == null)
                {
                    return BadRequest(new { errors = new List<string> { "Некорректный формат переданных данных" } });
                }

                var enterprise = new Models.Enterprise
                {
                
                    Name = dto.Name,
                    CityId = dto.CityId,
                    Contact = dto.Contact,
                    ContactPhone = dto.ContactPhone,
                    Note = dto.Note
                };
            

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
            catch
            {
                return BadRequest(new { errors = new List<string> { "Некорректный формат переданных данных" } });
            }
        }



        private const int PageSize = 20;

        public int TotalEnterprisesCount { get; set; }


        private async Task<bool> LoadPageDataAsync(string? searchString = null)
        {
            if (_context.Enterprises == null) return false;

            TotalEnterprisesCount = await _context.Enterprises.CountAsync();


            IQueryable<Enterprise> query = _context.Enterprises
                .AsNoTracking()
                .Include(e => e.City)
                .Include(e => e.Hosts)
                    .ThenInclude(h => h.Accesses)
                        .ThenInclude(a => a.AccessType);

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                string search = searchString.Trim().ToLower();
                query = query.Where(e => e.Name.ToLower().Contains(search)
                                      || e.Hosts.Any(h => h.Name.ToLower().Contains(search) || h.Ip.Contains(search)));
            }

            Enterprises = await query
                .OrderBy(e => e.Name)
                .Take(PageSize)
                .ToListAsync();

            if (_context.CityDictionaries != null)
            {
                var cities = await _context.CityDictionaries.AsNoTracking().OrderBy(c => c.Name).ToListAsync();
                CityList = new SelectList(cities, "Id", "Name");
            }

            if (_context.Accesses != null)
            {
                Accesses = await _context.Accesses.AsNoTracking().Include(a => a.AccessType).ToListAsync();
            }

            if (_context.Hosts != null)
            {
                HostsModel = await _context.Hosts.AsNoTracking().ToListAsync();
            }

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                UserFavoriteEnterpriseIds = new List<int>();
                return true; 
            }

            if (userId > 0)
            {
                UserFavoriteEnterpriseIds = await _context.UserFavorites
                    .AsNoTracking()
                    .Where(f => f.UserId == userId)
                    .Select(f => f.EnterpriseId)
                    .ToListAsync();
            }
            else
            {
                UserFavoriteEnterpriseIds = new List<int>();
            }

            return true;
        }

            public async Task<IActionResult> OnGetLoadMoreAsync(int offset, string searchString, int? cityId, bool isFavoriteOnly, string sortField, string sortOrder)
    {
        if (_context.Enterprises == null) return BadRequest();

        IQueryable<Enterprise> query = _context.Enterprises.AsNoTracking()
            .Include(e => e.City)
            .Include(e => e.Hosts);

        if (!string.IsNullOrWhiteSpace(searchString))
        {
            string search = searchString.Trim().ToLower();
            query = query.Where(e => 
                (e.Name != null && e.Name.ToLower().Contains(search)) ||
                e.Hosts.Any(h => (h.Name != null && h.Name.ToLower().Contains(search)) || (h.Ip != null && h.Ip.Contains(search)))
            );
        }

        if (cityId.HasValue && cityId.Value > 0)
        {
            query = query.Where(e => e.CityId == cityId.Value);
        }

        var favoriteIds = new List<int>();
        var useridClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (int.TryParse(useridClaim, out int userid))
        {
            favoriteIds = await _context.UserFavorites.AsNoTracking()
                .Where(f => f.UserId == userid)
                .Select(f => f.EnterpriseId)
                .ToListAsync();
        }

        if (isFavoriteOnly)
        {
            if (!int.TryParse(useridClaim, out _))
            {
                return new JsonResult(new List<object>());
            }
            query = query.Where(e => favoriteIds.Contains(e.Id));
        }










            bool isDesc = !string.IsNullOrWhiteSpace(sortOrder) && sortOrder.ToLower() == "desc";

            if (!string.IsNullOrWhiteSpace(sortField) && sortField.ToLower() == "date")
            {
                query = isDesc ? query.OrderByDescending(e => e.UpdatedAtUtc) : query.OrderBy(e => e.UpdatedAtUtc);
            }
            else
            {
                query = isDesc ? query.OrderByDescending(e => e.Name) : query.OrderBy(e => e.Name);
            }





            var paginatedEnterprises = await query
            
            .Skip(offset)
            .Take(PageSize)
            .Select(e => new
            {
                id = e.Id,
                name = e.Name,
                cityId = e.CityId,
                cityName = e.City != null ? e.City.Name : "Город не указан",
                contactUser = e.Contact,
                contactPhone = e.ContactPhone,
                note = e.Note,
                updatedAt = e.UpdatedAtUtc.ToString("dd.MM.yyyy HH:mm"),
                isFavorite = favoriteIds.Contains(e.Id),
                hostsCount = e.Hosts.Count,
                hostsPreview = e.Hosts.OrderBy(h => h.Name).Take(20).Select(h => h.Name).ToList(),
                
                hostsFull = e.Hosts.OrderBy(h => h.Name).Select(h => new
                {
                    id = h.Id,
                    name = h.Name,
                    ip = h.Ip,
                    osName = !string.IsNullOrWhiteSpace(h.OsName) ? h.OsName : "Linux",
                    osVer = !string.IsNullOrWhiteSpace(h.OsVer) ? h.OsVer : "N/A",
                    osType = !string.IsNullOrWhiteSpace(h.OsType) ? h.OsType : "64",
                    purpose = !string.IsNullOrWhiteSpace(h.Purpose) ? h.Purpose : "Общее",
                    accesses = _context.Accesses.AsNoTracking()
                        .Where(a => a.HostId == h.Id)
                        .Select(a => new
                        {
                            id = a.Id,
                            typeName = a.AccessType != null ? a.AccessType.Name : "Доступ",
                            socket = a.Port != 0 ? $"{a.Address}:{a.Port}" : a.Address,
                            login = a.Login,
                            passEncrypted = a.Pass != null ? CryptoHelper.Decrypt(a.Pass) : string.Empty,
                            files = _context.AccessFiles.AsNoTracking()
                                .Where(f => f.AccessId == a.Id)
                                .Select(f => new
                                {
                                    fileName = f.FileName,
                                    storedName = f.StoredFileName
                                }).ToList()
                        }).ToList()
                }).ToList()
            })
            .ToListAsync();

        return new JsonResult(paginatedEnterprises);
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
            
            int id = 0;

            try
            {



                // десериализация через dto класс
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var dto = JsonSerializer.Deserialize<EnterpriseDto>(data.GetRawText(), options);

                if (dto == null)
                {
                    return BadRequest(new { errors = new List<string> { "Некорректный формат переданных данных" } });
                }

                var enterprise = new Enterprise
                {

                    Id = dto.Id,
                    Name = dto.Name,
                    CityId = dto.CityId,
                    Contact = dto.Contact,
                    ContactPhone = dto.ContactPhone,
                    Note = dto.Note
                };
                
            

            var validationContext = new ValidationContext(enterprise);
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(enterprise, validationContext, validationResults, true))
            {
                var errors = validationResults.Select(r => r.ErrorMessage ?? "Ошибка").ToList();
                return BadRequest(new { errors = errors });
            }

            if (_context.Enterprises != null)
            {
                var dbEnterprise = await _context.Enterprises.FindAsync(enterprise.Id);
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
            catch
            {
                return BadRequest(new { errors = new List<string> { "Некорректный формат данных при обновлении" } });
            }
        }


        private async Task LogActionAsync(string entityType, int entityId, string actionType, string description, int? enterpriseIdToUpdate = null, int? hostIdToUpdate = null, int? accessIdToUpdate = null)
        {
            var currentUserName = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
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
                    enterprise.UpdatedAtUtc = DateTime.UtcNow;
                    _context.Entry(enterprise).State = EntityState.Modified;
                }
            }
            if (hostIdToUpdate.HasValue)
            {
                var host = await _context.Hosts.FindAsync(hostIdToUpdate.Value);
                if (host != null)
                {
                    host.UpdatedAtUtc = DateTime.UtcNow;
                    _context.Entry(host).State = EntityState.Modified;
                }
            }
            if (accessIdToUpdate.HasValue)
            {
                var access = await _context.Accesses.FindAsync(accessIdToUpdate.Value);
                if (access != null)
                {
                    access.UpdatedAtUtc = DateTime.UtcNow;
                    _context.Entry(access).State = EntityState.Modified;
                }
            }
        }





























        public class EnterpriseDto
        {
            
            public int Id { get; set; }

            public string Name { get; set; } = string.Empty;
            public int CityId { get; set; }

            public string Contact { get; set; } = string.Empty;
            public string ContactPhone { get; set; } = string.Empty;
            public string Note { get; set; } = string.Empty;

        }

    }
}
