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

        private const int PageSize = 20; 

        public async Task OnGetAsync()
        {
            if (_context.Enterprises != null)
            {
                ContactsList = await _context.Enterprises
                    .AsNoTracking()
                    .Where(e => e.Contact != null && e.Contact != "")
                    .OrderBy(e => e.Contact)
                    .Take(PageSize) 
                    .ToListAsync();
            }
        }

        public async Task<IActionResult> OnGetLoadMoreAsync(int offset, string searchString)
        {
            if (_context.Enterprises == null) return BadRequest();

            var query = _context.Enterprises.AsNoTracking()
                .Where(e => e.Contact != null && e.Contact != "");

            if (!string.IsNullOrWhiteSpace(searchString))
            {
                string search = searchString.Trim().ToLower();
                query = query.Where(e =>
                    (e.Name != null && e.Name.ToLower().Contains(search)) ||
                    (e.Contact != null && e.Contact.ToLower().Contains(search)) ||
                    (e.ContactPhone != null && e.ContactPhone.ToLower().Contains(search))
                );
            }

            var nextContacts = await query
                .OrderBy(e => e.Contact)
                .Skip(offset)
                .Take(PageSize)
                .Select(e => new
                {
                    id = e.Id,
                    enterpriseName = e.Name,
                    contactUser = e.Contact,
                    contactPhone = !string.IsNullOrWhiteSpace(e.ContactPhone) ? e.ContactPhone : "Нет телефона"
                })
                .ToListAsync();


            return new JsonResult(nextContacts);
        }



    }
}
