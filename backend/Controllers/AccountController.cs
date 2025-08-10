using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webApp.Data;
using webApp.Models;
using webApp.DTOs;

namespace webApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<Account> _passwordHasher;
        private readonly IConfiguration _config;

        public AccountController(AppDbContext context, IPasswordHasher<Account> passwordHasher, IConfiguration config)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Accounts.AnyAsync(a => a.Username == dto.Username))
                return Conflict(new { message = "Username already exists." });

            var account = new Account
            {
                Username = dto.Username,
                Role = "User"
            };
            account.PasswordHash = _passwordHasher.HashPassword(account, dto.Password);
            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var account = await _context.Accounts.SingleOrDefaultAsync(a => a.Username == dto.Username);
            if (account == null)
                return Unauthorized(new { message = "Invalid credentials." });

            var result = _passwordHasher.VerifyHashedPassword(account, account.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid credentials." });

            var token = GenerateJwtToken(account);
            return Ok(new { token });
        }

        [HttpGet("profile")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult<AccountProfileDto>> Profile()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var account = await _context.Accounts.SingleOrDefaultAsync(a => a.Username == username);
            if (account == null)
                return NotFound();

            return new AccountProfileDto
            {
                Id = account.Id,
                Username = account.Username,
                Role = account.Role
            };
        }

        private string GenerateJwtToken(Account account)
        {
            var jwtSettings = _config.GetSection("Jwt");

            var keyString = jwtSettings["Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                throw new InvalidOperationException("JWT Key configuration is missing.");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, account.Username),
                new Claim(ClaimTypes.Role, account.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(9),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}