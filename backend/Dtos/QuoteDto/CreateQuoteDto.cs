using backend.Enums;
using backend.services;

namespace backend.Dtos.QuoteDto
{
    public class CreateQuoteDto
    {
        public string BusinessName { get; set; } = string.Empty;

        public DateOnly Date { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);


        public string FirstResponse { get; set; } = string.Empty;

        public List<QuoteServiceItemDto> Services { get; set; } = new();

        public decimal AmountBeforeVat { get; set; }

        public decimal VatRate { get; set; }

        public decimal VatAmount { get; set; }

        public decimal TotalAmount { get; set; }
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
    }
}
