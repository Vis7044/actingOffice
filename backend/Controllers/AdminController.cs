using backend.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AdminController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet("admin")]
        public async Task<IActionResult> Test()
        {
            return Ok("Access granted to admin endpoint."); 
        }
    }
}
