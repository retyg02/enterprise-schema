using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using EnterpriseSchema.Data;
using EnterpriseSchema.Models;

namespace EnterpriseSchema.Pages
{
    public class LogsModel : PageModel
    {
        private readonly AppDbContext _context;

        public LogsModel(AppDbContext context)
        {
            _context = context;
        }

        public List<AuditLogDisplayItem> AuditLogs { get; set; } = new List<AuditLogDisplayItem>();

        private const int PageSize = 20;

        public async Task OnGetAsync()
        {
            if (_context.AuditLogs == null) return;

            var rawLogs = await _context.AuditLogs
                .AsNoTracking()
                .OrderByDescending(l => l.Timestamp)
                .Take(PageSize)
                .ToListAsync();

            AuditLogs = await MapLogNamesAsync(rawLogs);
        }

        public async Task<IActionResult> OnGetLoadMoreAsync(int offset, string searchString)
        {
            if (_context.AuditLogs == null) return BadRequest();


            if (string.IsNullOrWhiteSpace(searchString))
            {
                var nextRawLogs = await _context.AuditLogs.AsNoTracking()
                    .OrderByDescending(l => l.Timestamp)
                    .Skip(offset)
                    .Take(PageSize)
                    .ToListAsync();

                var mappedLogs = await MapLogNamesAsync(nextRawLogs);


                var jsonResult1 = mappedLogs.Select(log => new {
                    id = log.Id,
                    userId = log.UserId,
                    entityType = log.EntityType,
                    entityRealName = log.EntityRealName,
                    actionType = log.ActionType,
                    description = log.Description,
                    timestamp = log.Timestamp.ToString("dd.MM.yyyy HH:mm:ss")
                });

                return new JsonResult(jsonResult1);
            }

            string search = searchString.Trim().ToLower();

            var filteredQuery = _context.AuditLogs.AsNoTracking()
                .Where(l =>
                    (l.Description != null && l.Description.ToLower().Contains(search)) ||
                    (l.ActionType != null && l.ActionType.ToLower().Contains(search)) ||
                    (l.UserId != null && l.UserId.ToLower().Contains(search))
                )
                .OrderByDescending(l => l.Timestamp);

            var paginatedRawLogs = await filteredQuery
                .Skip(offset)
                .Take(PageSize)
                .ToListAsync();


            var mappedLogsForSearch = await MapLogNamesAsync(paginatedRawLogs);

            var jsonResult = mappedLogsForSearch.Select(log => new {
                id = log.Id,
                userId = log.UserId,
                entityType = log.EntityType,
                entityRealName = log.EntityRealName,
                actionType = log.ActionType,
                description = log.Description,
                timestamp = log.Timestamp.ToString("dd.MM.yyyy HH:mm:ss")
            });

            return new JsonResult(jsonResult);
        }






        private async Task<List<AuditLogDisplayItem>> MapLogNamesAsync(List<AuditLog> rawLogs)
        {
            if (!rawLogs.Any()) return new List<AuditLogDisplayItem>();

            var enterpriseIds = rawLogs.Where(l => l.EntityType == "Enterprise").Select(l => l.EntityId).Distinct().ToList();
            var hostIds = rawLogs.Where(l => l.EntityType == "Host").Select(l => l.EntityId).Distinct().ToList();
            var accessIds = rawLogs.Where(l => l.EntityType == "Access").Select(l => l.EntityId).Distinct().ToList();

            var enterprisesDict = _context.Enterprises != null
                ? await _context.Enterprises.AsNoTracking().Where(e => enterpriseIds.Contains(e.Id)).ToDictionaryAsync(e => e.Id, e => e.Name)
                : new Dictionary<int, string>();

            var hostsDict = _context.Hosts != null
                ? await _context.Hosts.AsNoTracking().Where(h => hostIds.Contains(h.Id)).ToDictionaryAsync(h => h.Id, h => h.Name)
                : new Dictionary<int, string>();

            var accessesDict = _context.Accesses != null
                ? await _context.Accesses.AsNoTracking().Include(a => a.AccessType).Where(a => accessIds.Contains(a.Id))
                    .ToDictionaryAsync(a => a.Id, a => $"{a.AccessType!.Name}: {a.Login}")
                : new Dictionary<int, string>();

            return rawLogs.Select(log =>
            {
                string realName = "Удаленный объект";

                if (log.EntityType == "Enterprise" && enterprisesDict.TryGetValue(log.EntityId, out var entName))
                    realName = entName;
                else if (log.EntityType == "Host" && hostsDict.TryGetValue(log.EntityId, out var hostName))
                    realName = hostName;
                else if (log.EntityType == "Access" && accessesDict.TryGetValue(log.EntityId, out var accName))
                    realName = accName;

                return new AuditLogDisplayItem
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    EntityType = log.EntityType,
                    EntityRealName = realName,
                    ActionType = log.ActionType,
                    Description = log.Description,
                    Timestamp = log.Timestamp
                };
            }).ToList();
        }

    }

    public class AuditLogDisplayItem
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public string EntityType { get; set; } = null!;
        public string EntityRealName { get; set; } = null!; 
        public string ActionType { get; set; } = null!;
        public string Description { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }
}
