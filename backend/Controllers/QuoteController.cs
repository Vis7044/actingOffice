using backend.Dtos.QuoteDto;
using backend.services.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly IQuoteService _quoteservice;
        public QuoteController(IQuoteService quoteService)
        {
            _quoteservice = quoteService;
        }
        private string GetUserId() =>
           User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;

        private string? GetRole() =>
            User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

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

        [HttpGet("get")]
        public async Task<IActionResult> GetAsync([FromQuery] int page = 1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm = "")
        {
            try
            {
                var quotes = await _quoteservice.GetQouteAsync(GetRole(), GetUserId(), page, pageSize, searchTerm);
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


        [HttpPut("update/{quoteId}")]
        public async Task<IActionResult> UpdateQuoteAsync([FromRoute] string quoteId, [FromBody] CreateQuoteDto dto)
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
    }
}
