using backend.Enums;
using backend.Models;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Dtos.QuoteDto
{
    /// <summary>
    /// class used to get the quote details,
    /// </summary>
    public class GetQuote
    {
        /// <summary>
        /// unique identifier for the quote,
        /// </summary>
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// randomly generated quote id,
        /// </summary>
        public string QuoteNumber { get; set; } = string.Empty;
        /// <summary>
        /// returns the list of services associated with the quote.
        /// </summary>
        public List<QuoteServiceItem>? Services { get; set; }
        /// <summary>
        /// returns the amount before applying VAT on total amount of the services.
        /// </summary>
        public decimal AmountBeforeVat { get; set; } = 0.0m;
        /// <summary>
        /// returns the amount after applying VAT on total amount of the services.
        /// </summary>
        public decimal VatAmount { get; set; } = 0.0m;
        /// <summary>
        /// stores the quote date
        /// </summary>
        public DateTime Date { get; set; }
        /// <summary>
        /// vat Rate applied to the quote, it can be 0 and 20 percent
        /// </summary>
        public decimal VatRate { get; set; } = 0.0m;
        /// <summary>
        /// status of the quote, it can be drafted, accepted or rejected
        /// </summary>
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        /// <summary>
        /// total amount of the services in the quote including VAT
        /// </summary>
        public decimal TotalAmount { get; set; } = 0.0m;
        /// <summary>
        /// Gets or sets the details of the business.
        /// </summary>
        public BusinessDetails? BusinessDetails { get; set; }
        /// <summary>
        /// returs the information of first responder
        /// </summary>
        public FirstResponse? FirstResponse { get; set; }
    }

    /// <summary>
    /// stores the business details,
    /// </summary>
    public class BusinessDetails
    {
        /// <summary>
        /// unique identifier for the business,
        /// </summary>
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// business name,
        /// </summary>
        public string BusinessName { get; set; } = string.Empty;
        /// <summary>
        /// business type
        /// </summary>
        public BusinessType Type { get; set; } = BusinessType.Individual;
        /// <summary>
        /// address of the business
        /// </summary>
        public ClientAddress? Address { get; set; }
    }
}
