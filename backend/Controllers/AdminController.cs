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
        public readonly IQuoteService _qouteService;
        public AdminController(IAuthService authService, IQuoteService qouteService)
        {
            _authService = authService;
            _qouteService = qouteService;
        }

        [HttpGet("admin")]
        public async Task<IActionResult> Test()
        {
            return Ok("Access granted to admin endpoint."); 
        }
        [HttpGet("users-quote-status")]
        public async Task<IActionResult> GetQuoteStatus([FromQuery] int page, [FromQuery]int pageSize)
        {
            return Ok(await _qouteService.GetUsersQuoteStatus(page,pageSize));
        }

        [HttpGet("daily-quote-stats")]
        public async Task<IActionResult> GetQuoteStats([FromQuery] int offset)
        {
            var result = await _qouteService.GetDailyQuoteDetails(offset);
            return Ok(result);
        }

        [HttpGet("user-quote-amount-stats")]
        public async Task<IActionResult> GetUserQuoteAmountStats([FromQuery] int offset)
        {
            var result = await _qouteService.GetUsersQuoteAmountStatus(offset);
            return Ok(result);
        }
    }
}
