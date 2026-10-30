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

        public async Task OnGetAsync()
        {
            if (_context.Hosts != null)
            {
                HostsList = await _context.Hosts
                    .AsNoTracking()
                    .Include(h => h.Enterprise)
                    .OrderBy(h => h.Name)
                    .ToListAsync();
            }
        }
    }
}
