using backend.Dtos.UserDto;
using backend.Models;

namespace backend.services.interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterUserAsync(RegisterUserDto userRegister);
        Task<UserModel> GetUserByIdAsync(string userId);
        Task<string> LoginAsync(LoginDto loginDto);
        Task<List<UserModel>> GetUsers();
    }
}
