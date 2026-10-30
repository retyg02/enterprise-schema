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

        public IList<Access> AccessesList { get; set; } = new List<Access>();

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
                    .ToListAsync();
            }
        }
    }
}
