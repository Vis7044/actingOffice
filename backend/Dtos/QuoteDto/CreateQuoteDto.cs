using backend.Enums;
using backend.Models;
using backend.services;

namespace backend.Dtos.QuoteDto
{
    public class CreateQuoteDto
    {
        public string BusinessName { get; set; } = string.Empty;

        public DateTime Date { get; set; } = DateTime.UtcNow;


        public FirstResponse? FirstResponse { get; set; } 

        public List<QuoteServiceItemDto> Services { get; set; } = new();

        public decimal AmountBeforeVat { get; set; }

        public decimal VatRate { get; set; }

        public decimal VatAmount { get; set; }

        public decimal TotalAmount { get; set; }
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        public ClientModel? BusinessDetails { get; set; }
        
    }
}
