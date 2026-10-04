using EnterpriseSchema.Data;
using EnterpriseSchema.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace EnterpriseSchema.Pages
{
    public class EnterpriseDetailsModel : PageModel
    {
        private readonly AppDbContext _context;
        public EnterpriseDetailsModel(AppDbContext context)
        {
            _context = context;
        }
        public Enterprise? Enterprise { get; set; } = default!;
        public async Task<IActionResult> OnGetAsync(int id)
        {
            var query = from e in _context.Enterprises where e.Id == id select e;
            
            Enterprise = await query.Include(e => e.Hosts).Include(e => e.Accesses).FirstOrDefaultAsync();
            
            if (Enterprise == null)
            {
                return NotFound();
            }
            
            if (Enterprise != null && Enterprise.Hosts != null)
            {
                foreach (var host in Enterprise.Hosts)
                {
                    await _context.Entry(host).Collection(h => h.Accesses).LoadAsync();
                }
            }
            
            return Page();
        }
    }
}
