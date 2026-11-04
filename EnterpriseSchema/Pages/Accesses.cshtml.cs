using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using EnterpriseSchema.Data;
using EnterpriseSchema.Models;

namespace EnterpriseSchema.Pages
{
    public class AccessesModel : PageModel
    {
        private readonly AppDbContext _context;

        public AccessesModel(AppDbContext context)
        {
            _context = context;
        }

        public IList<Access> AccessesList { get; set; } = [];

        private const int PageSize = 20;

        public async Task OnGetAsync()
        {
            if (_context.Accesses != null)
            {
                AccessesList = await _context.Accesses
                    .AsNoTracking()
                    .Include(a => a.AccessType)
                    .Include(a => a.Host)
                        .ThenInclude(h => h.Enterprise)
                    .OrderByDescending(a => a.UpdatedAtUtc)
                    .Take(PageSize)
                    .ToListAsync();
            }
        }

        public async Task<IActionResult> OnGetLoadMoreAsync(int offset, string searchString)
        {
            if (_context.Accesses == null) return BadRequest();

            IQueryable<EnterpriseSchema.Models.Access> query = _context.Accesses.AsNoTracking()
                .Include(a => a.AccessType)
                .Include(a => a.Host)
                    .ThenInclude(h => h.Enterprise);

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                string search = searchString.Trim().ToLower();

                int.TryParse(search, out int searchPort);

                query = query.Where(a =>
                    (a.AccessType != null && a.AccessType.Name != null && a.AccessType.Name.ToLower().Contains(search)) ||
                    (a.Host != null && a.Host.Name != null && a.Host.Name.ToLower().Contains(search)) ||
                    (a.Host != null && a.Host.Enterprise != null && a.Host.Enterprise.Name != null && a.Host.Enterprise.Name.ToLower().Contains(search)) ||
                    (a.Address != null && a.Address.ToLower().Contains(search)) ||
                    (a.Login != null && a.Login.ToLower().Contains(search)) ||
                    (a.Note != null && a.Note.ToLower().Contains(search)) ||
                    (searchPort != 0 && a.Port == searchPort)
                );
            }

            var nextAccesses = await query
                .OrderByDescending(a => a.UpdatedAtUtc)
                .Skip(offset)
                .Take(PageSize)
                .Select(a => new
                {
                    id = a.Id,
                    accessTypeName = a.AccessType != null ? a.AccessType.Name : string.Empty,
                    hostName = a.Host != null ? a.Host.Name : string.Empty,
                    enterpriseName = (a.Host != null && a.Host.Enterprise != null) ? a.Host.Enterprise.Name : string.Empty,
                    enterpriseId = (a.Host != null && a.Host.Enterprise != null) ? a.Host.Enterprise.Id : 0,
                    address = a.Address,
                    port = a.Port,
                    login = a.Login,
                    pass = a.Pass,
                    note = a.Note,
                    timestamp = a.UpdatedAtUtc.ToString("dd.MM.yyyy HH:mm")
                })
                .ToListAsync();


            return new JsonResult(nextAccesses);

        }


    }
}
