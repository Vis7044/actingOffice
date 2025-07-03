using backend.Enums;

namespace backend.Dtos.UserDto
{
    public class RegisterUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; } = null;
        public UserRole Role { get; set; } = UserRole.User; // Default role is User
    }
}
