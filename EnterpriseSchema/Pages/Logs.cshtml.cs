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

        public async Task OnGetAsync()
        {
            if (_context.AuditLogs == null) return;

            var rawLogs = await _context.AuditLogs.AsNoTracking().ToListAsync();

            var enterprisesDict = _context.Enterprises != null
                ? await _context.Enterprises.AsNoTracking().ToDictionaryAsync(e => e.Id, e => e.Name)
                : new Dictionary<int, string>();

            var hostsDict = _context.Hosts != null
                ? await _context.Hosts.AsNoTracking().ToDictionaryAsync(h => h.Id, h => h.Name)
                : new Dictionary<int, string>();

            var accessesDict = _context.Accesses != null
                ? await _context.Accesses.AsNoTracking().Include(a => a.AccessType).ToDictionaryAsync(a => a.Id, a => $"{a.AccessType?.Name ?? "Доступ"}: {a.Login}")
                : new Dictionary<int, string>();

            AuditLogs = rawLogs.Select(log =>
            {
                string realName = "Удаленный объект"; 

                if (log.EntityType == "Enterprise" && enterprisesDict.TryGetValue(log.EntityId, out var entName))
                {
                    realName = entName;
                }
                else if (log.EntityType == "Host" && hostsDict.TryGetValue(log.EntityId, out var hostName))
                {
                    realName = hostName;
                }
                else if (log.EntityType == "Access" && accessesDict.TryGetValue(log.EntityId, out var accName))
                {
                    realName = accName;
                }

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
            })
            .OrderByDescending(l => l.Timestamp)
            .ToList();
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
