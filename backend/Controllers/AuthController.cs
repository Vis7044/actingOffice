using backend.Dtos.UserDto;
using backend.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] RegisterUserDto userRegister)
        {
            try
            {
                var result = await _authService.RegisterUserAsync(userRegister);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto loginDto)
        {
            try
            {
                var token = await _authService.LoginAsync(loginDto);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserByIdAsync()
        {
            try
            {
                var userId = GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User ID is not available.");
                }
                var user = await _authService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
