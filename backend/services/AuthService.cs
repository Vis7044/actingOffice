using backend.Data;
using backend.Dtos.UserDto;
using backend.Models;
using backend.services.interfaces;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.services
{
    public class AuthService: IAuthService
    {
        private readonly MongoDbContext _context;
        private readonly IMongoCollection<UserModel> _user;
        private readonly IConfiguration configuration;
        public AuthService(MongoDbContext context, IConfiguration configuration)
        {
            _user = context.Users;
            this.configuration = configuration;
        }

        public async Task<string> RegisterUserAsync(RegisterUserDto userDto)
        {
            // eck if the user already exists
            var existingUser = await _user.Find(u => u.Email == userDto.Email).FirstOrDefaultAsync();
            if (existingUser != null) {
                throw new  Exception("User with this email already exists");
            }
            // Create a new user model from the DTO
            var userData = new UserModel
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password), 
                DateOfBirth = userDto.DateOfBirth,
                Role = userDto.Role
            };
            try
            {
                await _user.InsertOneAsync(userData);
                return "User registered successfully";  
            }catch(Exception ex)
            {
                
                throw new  Exception($"Error registering user: {ex.Message}");
            }
        }

        public async Task<string> LoginAsync(LoginDto loginDto)
        {
            // Find the user by email
            var user = await _user.Find(u => u.Email == loginDto.Email).FirstOrDefaultAsync();
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                throw new Exception("Invalid Credentials");
            }
           
            // Generate JWT token
            var token = GenerateToken(user.Id,user.Email,user.Role.ToString());
            return token;
        }

        public async Task<UserModel> GetUserByIdAsync(string userId)
        {
            // Find the user by ID
            var user = await _user.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new Exception("User not found");
            }
            return user;
        }

        private string GenerateToken(string id,string email,string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)    
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
