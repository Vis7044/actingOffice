using backend.Dtos.QuoteDto;
using backend.Models;
using backend.services;
using backend.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly IQuoteService _quoteservice;
        public QuoteController(IQuoteService quoteService)
        {
            _quoteservice = quoteService;
        }
        /// <summary>
        /// get the user id from the claims
        /// </summary>
        /// <returns></returns>
        private string GetUserId() =>
           User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        /// <summary>
        /// get the role of the user from the claims
        /// </summary>
        /// <returns></returns>
        private string? GetRole() =>
            User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        /// <summary>
        /// create a new quote
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<IActionResult> CreateQuoteAsync([FromBody] CreateQuoteDto dto)
        {
            try
            {
                var result = await _quoteservice.CreateQuoteAsync(dto, GetUserId());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// get all quotes with pagination and search functionality
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="searchTerm"></param>
        /// <param name="criteria"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        [HttpGet("get")]
        public async Task<IActionResult> GetAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm = "",[FromQuery] string criteria = "",[FromQuery] string value = "")
        {
            try
            {
                var quotes = await _quoteservice.GetQouteAsync(GetRole(), GetUserId(), page, pageSize, searchTerm,criteria,value);
                return Ok(quotes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="quoteId"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet("get/{quoteId}")]
        public async Task<IActionResult> GetQuoteByIdAsync([FromRoute] string quoteId)
        {
            try
            {
                var quote = await _quoteservice.GetQuoteById(quoteId);
                return Ok(quote);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// update a quote
        /// </summary>
        /// <param name="quoteId"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPut("update/{quoteId}")]
        public async Task<IActionResult> UpdateQuoteAsync([FromRoute] string quoteId, [FromBody] QuoteModel dto)
        {
            try
            {
                var result = await _quoteservice.UpdateQuoteAsync(dto, GetUserId(), GetRole(), quoteId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete/{quoteId}")]
        public async Task<IActionResult> DeleteQuoteAsync([FromRoute] string quoteId)
        {
            try
            {
                await _quoteservice.DeleteClientAsync(quoteId, GetUserId(), GetRole());
                return Ok("Quote deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// get quote stats
        /// </summary>
        /// <returns></returns>
        [HttpGet("get/stats")]
        public async Task<IActionResult> GetQuoteStats()
        {
            var stats = await _quoteservice.GetQuoteStats(GetRole(),GetUserId());

            if (stats == null)
            {
                return NotFound("No quotes found.");
            }

            return Ok(stats);
        }



    }
}
