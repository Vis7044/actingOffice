using backend.Dtos.QuoteDto;
using backend.services.interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public async Task<IActionResult> CreateQuoteAsync([FromBody] CreateQuoteDto dto)
        {
            try
            {
                var result = await _quoteservice.CreateQuoteAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
