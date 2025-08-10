using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims; 
using webApp.Data;
using webApp.Models;
using webApp.DTOs;

namespace webApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAll([FromQuery] string? search)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
                return Unauthorized();

            var query = _context.Employees
                .Where(e => e.UserId == currentUserId);

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(e =>
                    e.FirstName.Contains(search) ||
                    e.LastName.Contains(search) ||
                    e.Email.Contains(search));
            }

            var employees = await query.Select(e => new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Position = e.Position
            }).ToListAsync();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> Get(int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
                return Unauthorized();

            var e = await _context.Employees.FindAsync(id);

            if (e == null || e.UserId != currentUserId)
                return NotFound();

            return new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Position = e.Position
            };
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Create(EmployeeCreateDto dto)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
                return Unauthorized();

            if (await _context.Employees.AnyAsync(e => e.Email == dto.Email && e.UserId == currentUserId))
                return Conflict(new { message = "Email already exists." });

            var e = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Position = dto.Position,
                UserId = currentUserId
            };

            _context.Employees.Add(e);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = e.Id }, new EmployeeDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                Phone = e.Phone,
                Position = e.Position
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmployeeUpdateDto dto)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
                return Unauthorized();

            var e = await _context.Employees.FindAsync(id);

            if (e == null || e.UserId != currentUserId)
                return NotFound();

            if (e.Email != dto.Email && await _context.Employees.AnyAsync(emp => emp.Email == dto.Email && emp.UserId == currentUserId))
                return Conflict(new { message = "Email already exists." });

            e.FirstName = dto.FirstName;
            e.LastName = dto.LastName;
            e.Email = dto.Email;
            e.Phone = dto.Phone;
            e.Position = dto.Position;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
                return Unauthorized();

            var e = await _context.Employees.FindAsync(id);
            if (e == null || e.UserId != currentUserId)
                return NotFound();

            _context.Employees.Remove(e);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
