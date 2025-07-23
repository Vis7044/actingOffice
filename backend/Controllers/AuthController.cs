using backend.Dtos.UserDto;
using backend.Models;
using backend.services.interfaces;
using backend.Validator;
using FluentValidation;
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
        private readonly IValidator<RegisterUserDto> _validator;
        private readonly IValidator<LoginDto> _loginValidator;
        public AuthController(IAuthService authService, IValidator<RegisterUserDto> validator, IValidator<LoginDto> loginValidator)
        {
            _authService = authService;
            _validator = validator;
            _loginValidator = loginValidator;
        }
        /// <summary>
        /// private method to get the user id from the claims
        /// </summary>
        /// <returns></returns>
        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        /// <summary>
        /// get all the users
        /// </summary>
        /// <returns></returns>
        [HttpGet("get")]
        public async Task<IActionResult> GetUsers()
        {
             try
            {
                var users = await _authService.GetUsers();
                if (users == null)
                {
                    return NotFound("User not found.");
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// controller to register a new user
        /// </summary>
        /// <param name="userRegister"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUserAsync([FromBody] RegisterUserDto userRegister)
        {
            var resultValid = _validator.ValidateAsync(userRegister);
            if (!resultValid.Result.IsValid)
            {   
                return BadRequest(resultValid.Result.Errors.Select(e => new
                {
                    Feild = e.PropertyName,
                    Message = e.ErrorMessage
                }));  
            }
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
        /// <summary>
        /// controller to login a user  
        /// </summary>
        /// <param name="loginDto"></param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto loginDto)
        {
            var resultValid = _loginValidator.ValidateAsync(loginDto);
            if (!resultValid.Result.IsValid)
            {
                return BadRequest(resultValid.Result.Errors.Select(e => new
                {
                    Field = e.PropertyName,
                    Message = e.ErrorMessage
                }));
            }
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
        /// <summary>
        /// Retrieves the current user's information based on their user ID.
        /// </summary>
       
        /// user's details if the user ID is valid and the user exists in the system.</remarks>
        /// <returns>An <see cref="IActionResult"/> containing the user's information if found; otherwise, a <see
        
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
