using backend.Enums;
using backend.Models;
using backend.services;

namespace backend.Dtos.QuoteDto
{
    /// <summary>
    /// this calss is used to when creating a new quote,
    /// </summary>
    public class CreateQuoteDto
    {
        /// <summary>
        /// stores the name of the business or client,
        /// </summary>
        public string BusinessName { get; set; } = string.Empty;
        /// <summary>
        /// Gets or sets the date and time value, initialized to the current UTC date and time.
        /// </summary>

        public DateTime Date { get; set; } = DateTime.UtcNow;
        /// <summary>
        /// stores the first responder information,
        /// </summary>
        public FirstResponse? FirstResponse { get; set; }
        /// <summary>
        /// stores the list of services included in the quote,
        /// </summary>
        public List<QuoteServiceItemDto> Services { get; set; } = new();
        /// <summary>
        /// Gets or sets the amount before Value Added Tax (VAT) is applied.
        /// </summary>
        public decimal AmountBeforeVat { get; set; }
        /// <summary>
        /// Gets or sets the VAT (Value Added Tax) rate as a decimal percentage.
        /// </summary>
        public decimal VatRate { get; set; }
        /// <summary>
        /// amount after applying VAT on total amount of the services
        /// </summary>
        public decimal VatAmount { get; set; }
        /// <summary>
        /// total amount of the services in the quote including VAT
        /// </summary>
        public decimal TotalAmount { get; set; }
        /// <summary>
        /// status of the quote, it can be drafted, accepted or rejected
        /// </summary>
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        /// <summary>
        /// stores the client or business details,
        /// </summary>
        public ClientModel? BusinessDetails { get; set; }
        
    }
}
