using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using EnterpriseSchema.Data;
using EnterpriseSchema.Models;

namespace EnterpriseSchema.Pages
{
    public class HostsModel : PageModel
    {
        private readonly AppDbContext _context;

        public HostsModel(AppDbContext context)
        {
            _context = context;
        }

        public IList<Models.Host> HostsList { get; set; } = new List<Models.Host>();

        private const int PageSize = 20;

        public async Task OnGetAsync()
        {
            if (_context.Hosts != null)
            {
                HostsList = await _context.Hosts
                    .AsNoTracking()
                    .Include(h => h.Enterprise)
                    .OrderBy(h => h.Name)
                    .Take(PageSize)
                    .ToListAsync();
            }
        }

        public async Task<IActionResult> OnGetLoadMoreAsync(int offset, string searchString)
        {
            if (_context.Hosts == null) return BadRequest();

            IQueryable<EnterpriseSchema.Models.Host> query = _context.Hosts.AsNoTracking()
                .Include(h => h.Enterprise);

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                string search = searchString.Trim().ToLower();
                query = query.Where(h =>
                    (h.Name != null && h.Name.ToLower().Contains(search)) ||
                    (h.Ip != null && h.Ip.ToLower().Contains(search)) ||
                    (h.Purpose != null && h.Purpose.ToLower().Contains(search)) ||
                    (h.OsName != null && h.OsName.ToLower().Contains(search)) ||
                    (h.Notes != null && h.Notes.ToLower().Contains(search)) ||
                    (h.Enterprise != null && h.Enterprise.Name != null && h.Enterprise.Name.ToLower().Contains(search))
                );
            }

            var nextHosts = await query
                .OrderBy(h => h.Name)
                .Skip(offset)
                .Take(PageSize)
                .Select(h => new
                {
                    id = h.Id,
                    name = h.Name,
                    ip = h.Ip,
                    purpose = h.Purpose,
                    osName = !string.IsNullOrWhiteSpace(h.OsName) ? h.OsName : "Linux",
                    osVer = !string.IsNullOrWhiteSpace(h.OsVer) ? h.OsVer : "N/A",
                    osType = !string.IsNullOrWhiteSpace(h.OsType) ? h.OsType : "64",
                    notes = !string.IsNullOrWhiteSpace(h.Notes) ? h.Notes : "—",
                    enterpriseId = h.EnterpriseId,
                    enterpriseName = h.Enterprise != null ? h.Enterprise.Name : "Удалено",
                    createdAt = h.CreatedAtUtc.ToString("dd.MM.yyyy HH:mm")
                })
                .ToListAsync();


            return new JsonResult(nextHosts);
        }


    }
}
