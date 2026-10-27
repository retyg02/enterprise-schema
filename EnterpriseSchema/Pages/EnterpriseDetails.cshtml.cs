using EnterpriseSchema.Data;
using EnterpriseSchema.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;


namespace EnterpriseSchema.Pages
{
    public class EnterpriseDetailsModel : PageModel
    {
        private readonly AppDbContext _context;
        public EnterpriseDetailsModel(AppDbContext context)
        {
            _context = context;
        }
        public Enterprise? Enterprise { get; set; }
        public SelectList? ServiceList { get; set; }
        public SelectList? AccessTypeList { get; set; }


        public async Task<IActionResult> OnPostCreateHostAsync([FromBody] JsonElement data)
        {
            var host = new Models.Host();
            int enterpriseId = 0;

            try
            {
                if (data.TryGetProperty("enterpriseId", out var entProp)) enterpriseId = entProp.GetInt32();
                if (data.TryGetProperty("name", out var nameProp)) host.Name = nameProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("ip", out var ipProp)) host.Ip = ipProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("purpose", out var purpProp)) host.Purpose = purpProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("osName", out var osNProp)) host.OsName = osNProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("osVer", out var osVProp)) host.OsVer = osVProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("osType", out var osTProp)) host.OsType = osTProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("networkInterfaces", out var netProp)) host.NetworkInterfaces = netProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("notes", out var noteProp)) host.Notes = noteProp.GetString();
            }
            catch
            {
                return BadRequest(new { errors = new List<string> { "Некорректный формат переданных данных" } });
            }

            host.EnterpriseId = enterpriseId;

            ModelState.Remove("host.Enterprise");
            ModelState.Remove("host.Services");

            var validationContext = new ValidationContext(host);
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(host, validationContext, validationResults, true))
            {
                var errors = validationResults.Select(r => r.ErrorMessage ?? "Ошибка").ToList();
                return BadRequest(new { errors = errors });
            }

            if (_context.Hosts != null)
            {
                _context.Hosts.Add(host);
                await _context.SaveChangesAsync();

                await LogActionAsync("Host", host.Id, "Create", $"Создан хост «{host.Name}»", enterpriseIdToUpdate: enterpriseId);
                await _context.SaveChangesAsync();
            }

            return new JsonResult(new { success = true });
        }

        public async Task<IActionResult> OnPostDeleteHostAsync(int id)
        {
            if (_context.Hosts != null)
            {
                var host = await _context.Hosts.FindAsync(id);
                if (host != null)
                {


                    if (_context.Accesses != null)
                    {
                        var dependentAccesses = await _context.Accesses
                            .Where(a => a.HostId == id)
                            .ToListAsync();

                        if (dependentAccesses.Any())
                        {
                            foreach (var access in dependentAccesses)
                            {
                                await LogActionAsync(
                                    "Access",
                                    access.Id,
                                    "Delete",
                                    $"Удален связанный доступ {access.Login} из-за удаления сервера {host.Name}"
                                );
                            }

                            _context.Accesses.RemoveRange(dependentAccesses);
                            await _context.SaveChangesAsync();
                        }
                    }


                    int parentEnterpriseId = host.EnterpriseId;

                    _context.Hosts.Remove(host);
                    await _context.SaveChangesAsync();

                    await LogActionAsync("Host", host.Id, "Delete", $"Удален хост «{host.Name}»", enterpriseIdToUpdate: parentEnterpriseId);
                    await _context.SaveChangesAsync();
                }
            }

            return new JsonResult(new { success = true });
        }

        public async Task<IActionResult> OnPostCreateAccessAsync([FromBody] JsonElement data)
        {
            var access = new Access();
            int hostId = 0;

            try
            {
                if (data.TryGetProperty("hostId", out var hProp)) hostId = hProp.GetInt32();
                if (data.TryGetProperty("accessTypeId", out var typeProp)) access.AccessTypeId = typeProp.GetInt32();
                if (data.TryGetProperty("address", out var addrProp)) access.Address = addrProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("port", out var portProp)) access.Port = portProp.GetInt32();
                if (data.TryGetProperty("login", out var logProp)) access.Login = logProp.GetString() ?? string.Empty;

                if (data.TryGetProperty("pass", out var passProp))
                {
                    string rawPass = passProp.GetString() ?? string.Empty;

                    if (rawPass.Length < 2 || rawPass.Length > 50)
                    {
                        return BadRequest(new { errors = new List<string> { "Пароль доступа должен содержать от 2 до 50 символов" } });
                    }

                    access.Pass = CryptoHelper.Encrypt(rawPass);
                }

                if (data.TryGetProperty("note", out var noteProp)) access.Note = noteProp.GetString();
            }
            catch
            {
                return BadRequest(new { errors = new List<string> { "Некорректный формат данных доступа" } });
            }

            access.HostId = hostId;

            ModelState.Remove("access.Host");
            ModelState.Remove("access.AccessType");

            var validationContext = new ValidationContext(access);
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(access, validationContext, validationResults, true))
            {
                var errors = validationResults.Select(r => r.ErrorMessage ?? "Ошибка").ToList();
                return BadRequest(new { errors = errors });
            }

            if (_context.Accesses != null)
            {
                _context.Accesses.Add(access);
                await _context.SaveChangesAsync(); 

                int parentEnterpriseId = 0;
                var relatedHost = await _context.Hosts.FindAsync(access.HostId);
                if (relatedHost != null)
                {
                    parentEnterpriseId = relatedHost.EnterpriseId;

                    relatedHost.UpdatedAt = DateTime.Now;
                    _context.Entry(relatedHost).State = EntityState.Modified;
                }

                string accessTypeName = "Неизвестный тип";
                var typeDict = await _context.AccessTypeDictionaries.FindAsync(access.AccessTypeId);
                if (typeDict != null)
                {
                    accessTypeName = typeDict.Name;
                }

                await LogActionAsync(
                    entityType: "Access",
                    entityId: access.Id,
                    actionType: "Create",
                    description: $"Создан доступ «{accessTypeName}»",
                    enterpriseIdToUpdate: parentEnterpriseId != 0 ? parentEnterpriseId : null
                );

                access.UpdatedAt = DateTime.Now;
                _context.Entry(access).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }


            return new JsonResult(new { success = true });
        }






        public async Task<IActionResult> OnPostUpdateHostAsync([FromBody] JsonElement data)
        {
            var host = new Models.Host();
            int id = 0;
            var servicesToCreate = new List<ServiceDict>();

            try
            {
                if (data.TryGetProperty("id", out var idProp)) id = idProp.GetInt32();
                if (data.TryGetProperty("name", out var nameProp)) host.Name = nameProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("ip", out var ipProp)) host.Ip = ipProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("purpose", out var purpProp)) host.Purpose = purpProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("osName", out var osNProp)) host.OsName = osNProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("osVer", out var osVProp)) host.OsVer = osVProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("osType", out var osTProp)) host.OsType = osTProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("networkInterfaces", out var netProp)) host.NetworkInterfaces = netProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("notes", out var noteProp)) host.Notes = noteProp.GetString();

                if (data.TryGetProperty("newServices", out var srvsProp) && srvsProp.ValueKind == JsonValueKind.Array)
                {
                    foreach (var srvElement in srvsProp.EnumerateArray())
                    {
                        servicesToCreate.Add(new ServiceDict
                        {
                            Name = srvElement.GetProperty("name").GetString() ?? string.Empty,
                            Description = srvElement.GetProperty("description").GetString(),
                            Path = srvElement.GetProperty("path").GetString() ?? string.Empty,
                            HostId = id
                        });
                    }
                }
            }
            catch
            {
                return BadRequest(new { errors = new List<string> { "Некорректный формат данных транзакции" } });
            }

            ModelState.Remove("host.Enterprise");
            ModelState.Remove("host.Services");

            var validationContext = new ValidationContext(host);
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(host, validationContext, validationResults, true))
            {
                var errors = validationResults.Select(r => r.ErrorMessage ?? "Ошибка").ToList();
                return BadRequest(new { errors = errors });
            }

            if (_context.Hosts != null)
            {
                var dbHost = await _context.Hosts.FindAsync(id);
                if (dbHost != null)
                {
                    dbHost.Name = host.Name;
                    dbHost.Ip = host.Ip;
                    dbHost.Purpose = host.Purpose;
                    dbHost.OsName = host.OsName;
                    dbHost.OsVer = host.OsVer;
                    dbHost.OsType = host.OsType;
                    dbHost.NetworkInterfaces = host.NetworkInterfaces;
                    dbHost.Notes = host.Notes;

                    _context.Entry(dbHost).State = EntityState.Modified;

                    if (servicesToCreate.Count > 0 && _context.Set<ServiceDict>() != null)
                    {
                        await _context.Set<ServiceDict>().AddRangeAsync(servicesToCreate);
                    }

                    await _context.SaveChangesAsync();

                    await LogActionAsync("Host", host.Id, "Update", $"Обновлен хост «{host.Name}»", hostIdToUpdate: host.Id, enterpriseIdToUpdate: host.EnterpriseId); 
                    await _context.SaveChangesAsync();
                }
            }

            return new JsonResult(new { success = true });
        }


        public async Task<IActionResult> OnPostCreateServiceAsync([FromBody] JsonElement data)
        {
            string name = string.Empty;
            string description = string.Empty;
            string path = string.Empty;
            int hostId = 0;

            try
            {
                if (data.TryGetProperty("name", out var nProp)) name = nProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("description", out var dProp)) description = dProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("path", out var pProp)) path = pProp.GetString() ?? string.Empty;
                if (data.TryGetProperty("hostId", out var hProp)) hostId = hProp.GetInt32();
            }
            catch
            {
                return BadRequest(new { error = "Некорректный формат данных службы" });
            }

            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(path))
            {
                return BadRequest(new { error = "Имя службы и Путь обязательны для заполнения!" });
            }

            if (_context.ServiceDictionaries != null)
            {
                var exists = await _context.ServiceDictionaries.AnyAsync(s => s.HostId == hostId && s.Name.ToLower() == name.ToLower());
                if (!exists)
                {
                    var newService = new ServiceDict
                    {
                        Name = name,
                        Description = description,
                        Path = path,
                        HostId = hostId
                    };
                    _context.ServiceDictionaries.Add(newService);
                    await _context.SaveChangesAsync();

                    return new JsonResult(new { success = true });
                }
            }

            return BadRequest(new { error = "Такая служба уже развернута на этом сервере" });
        }







        public async Task<IActionResult> OnPostCreateAccessTypeAsync([FromBody] string newTypeName)
        {
            if (string.IsNullOrWhiteSpace(newTypeName) || _context.AccessTypeDictionaries == null)
            {
                return BadRequest(new { error = "Название типа доступа не может быть пустым" });
            }

            var existingType = await _context.AccessTypeDictionaries
                .FirstOrDefaultAsync(t => t.Name.ToLower() == newTypeName.ToLower());

            if (existingType != null)
            {
                return new JsonResult(new { id = existingType.Id, name = existingType.Name });
            }

            var accessType = new AccessTypeDict { Name = newTypeName };
            _context.AccessTypeDictionaries.Add(accessType);
            await _context.SaveChangesAsync();

            return new JsonResult(new { id = accessType.Id, name = accessType.Name });
        }



        public async Task<IActionResult> OnPostDeleteAccessAsync(int id)
        {
            if (_context.Accesses != null)
            {
                var access = await _context.Accesses.FindAsync(id);
                if (access != null)
                {
                    int? parentHostId = access.HostId;
                    int? parentEnterpriseId = null;

                    if (_context.Hosts != null)
                    {
                        var relatedHost = await _context.Hosts.FindAsync(parentHostId);
                        if (relatedHost != null)
                        {
                            parentEnterpriseId = relatedHost.EnterpriseId;

                            relatedHost.UpdatedAt = DateTime.Now;
                            _context.Entry(relatedHost).State = EntityState.Modified;
                        }
                    }

                    _context.Accesses.Remove(access);
                    await _context.SaveChangesAsync();


                    string accessTypeName = "Неизвестный тип";
                    var typeDict = await _context.AccessTypeDictionaries.FindAsync(access.AccessTypeId);
                    if (typeDict != null)
                    {
                        accessTypeName = typeDict.Name;
                    }

                    await LogActionAsync(
                        entityType: "Access",
                        entityId: id,
                        actionType: "Delete",
                        description: $"Удален доступ с логином «{accessTypeName}»",
                        enterpriseIdToUpdate: parentEnterpriseId
                    );

                    await _context.SaveChangesAsync();
                }
            }
            return new JsonResult(new { success = true });
        }






        public async Task<IActionResult> OnPostDeleteServiceAsync(int id)
        {
            if (_context.ServiceDictionaries != null)
            {
                var service = await _context.ServiceDictionaries.FindAsync(id);
                if (service != null)
                {
                    _context.ServiceDictionaries.Remove(service);
                    await _context.SaveChangesAsync();
                }
            }

            return new JsonResult(new { success = true });
        }




        public async Task<IActionResult> OnGetAsync(int id)
        {
            Enterprise = await _context.Enterprises
                .Include(e => e.City)
                .Include(e => e.Hosts)
                    .ThenInclude(h => h.Accesses)
                        .ThenInclude(a => a.AccessType)
                .Include(e => e.Hosts)
                    .ThenInclude(h => h.Services)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (Enterprise == null)
            {
                return NotFound();
            }

            if (_context.ServiceDictionaries != null)
            {
                var services = await _context.ServiceDictionaries.OrderBy(s => s.Name).ToListAsync();
                ServiceList = new SelectList(services, "Id", "Name");
            }

            if (_context.AccessTypeDictionaries != null)
            {
                var types = await _context.AccessTypeDictionaries.OrderBy(t => t.Name).ToListAsync();
                AccessTypeList = new SelectList(types, "Id", "Name");
            }


            return Page();
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
