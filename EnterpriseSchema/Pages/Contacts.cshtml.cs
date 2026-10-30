using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using EnterpriseSchema.Data;
using EnterpriseSchema.Models;

namespace EnterpriseSchema.Pages
{
    public class ContactsModel : PageModel
    {
        private readonly AppDbContext _context;

        public ContactsModel(AppDbContext context)
        {
            _context = context;
        }

        public IList<Enterprise> ContactsList { get; set; } = new List<Enterprise>();

        public async Task OnGetAsync()
        {
            if (_context.Enterprises != null)
            {
                ContactsList = await _context.Enterprises
                    .AsNoTracking()
                    .Where(e => e.Contact != null && e.Contact != "")
                    .OrderBy(e => e.Contact)
                    .ToListAsync();
            }
        }
    }
}
