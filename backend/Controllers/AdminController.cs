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
        /// <summary>
        /// Constructor for AdminController
        /// </summary>
        /// <param name="authService"></param>
        /// <param name="qouteService"></param>
        public AdminController(IAuthService authService, IQuoteService qouteService)
        {
            _authService = authService;
            _qouteService = qouteService;
        }
        /// <summary>
        /// est endpoint to verify admin access
        /// </summary>
        /// <returns></returns>

        [HttpGet("admin")]
        public async Task<IActionResult> Test()
        {
            return Ok("Access granted to admin endpoint."); 
        }
        /// <summary>
        /// controller to get all users total number of quotes and their status
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("users-quote-status")]
        public async Task<IActionResult> GetQuoteStatus([FromQuery] int page, [FromQuery]int pageSize)
        {
            return Ok(await _qouteService.GetUsersQuoteStatus(page,pageSize));
        }
        /// <summary>
        /// controller to get daily quote details of a month
        /// </summary>
        /// <param name="offset">offset represent number 0 means current month and -1 means previous month</param>
        /// <returns></returns>
        [HttpGet("daily-quote-stats")]
        public async Task<IActionResult> GetQuoteStats([FromQuery] int offset)
        {
            var result = await _qouteService.GetDailyQuoteDetails(offset);
            return Ok(result);
        }
        /// <summary>
        /// controller to get user quote amount stats of a month
        /// </summary>
        /// <param name="offset">offset represents number 0 means current month and -1 means previous month</param>
        /// <returns></returns>
        [HttpGet("user-quote-amount-stats")]
        public async Task<IActionResult> GetUserQuoteAmountStats([FromQuery] int offset)
        {
            var result = await _qouteService.GetUsersQuoteAmountStatus(offset);
            return Ok(result);
        }
    }
}
