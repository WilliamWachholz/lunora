using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LunoraBackend.Models;
using LunoraBackend.DAO;

namespace LunoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly LunoraContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(LunoraContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromForm] string email, [FromForm] string name, [FromForm] string password)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return BadRequest("User with this email already exists");
            }

            // Create password hash
            var passwordHasher = new PasswordHasher<User>();

            User user = new User();
            user.Name = name;
            user.Email = email;

            user.Password = passwordHasher.HashPassword(user, password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponse
            {
                Token = token,
                User = user
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(Auth auth)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == auth.Email);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, auth.Password);
            
            if (result != PasswordVerificationResult.Success)
            {
                return Unauthorized("Invalid credentials");
            }

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponse
            {
                Token = token,
                User = user
            });
        }

        // [Authorize]
        // [HttpGet("profile")]
        // public async Task<ActionResult<UserDto>> GetProfile()
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     if (string.IsNullOrEmpty(userId))
        //     {
        //         return Unauthorized();
        //     }

        //     var user = await _context.Users.FindAsync(int.Parse(userId));
        //     if (user == null)
        //     {
        //         return NotFound("User not found");
        //     }

        //     return Ok(new UserDto
        //     {
        //         Id = user.Id,
        //         Name = user.Name,
        //         Email = user.Email,
        //         Role = user.Role
        //     });
        // }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {// Use JWT standard claim types
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // ← "sub" claim
                new Claim(JwtRegisteredClaimNames.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(   
                issuer: _configuration["JwtSettings:Issuer"],        
                audience: _configuration["JwtSettings:Audience"],             
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}