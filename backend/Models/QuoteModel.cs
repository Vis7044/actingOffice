using backend.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class QuoteModel
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
        /// information of the first respondent
        /// </summary>
        public FirstResponse? FirstResponse { get; set; }
        /// <summary>
        /// list of services included in the quote, 
        /// </summary>
        public List<QuoteServiceItem>? Services { get; set; }
        /// <summary>
        /// stores the creator information,
        /// </summary>
        public CreatedBy? CreatedBy { get; set; }
        /// <summary>
        /// stores the date of the quote
        /// </summary>
        public DateTime Date { get; set; } = DateTime.UtcNow;
        /// <summary>
        /// it is the amount before applying VAT on total amount of the services
        /// </summary>
        public decimal AmountBeforeVat { get; set; } = 0.0m;
        /// <summary>
        /// amount after applying VAt on total amount of the services
        /// </summary>
        public decimal VatAmount { get; set; } = 0.0m;
        /// <summary>
        /// vat Rate applied to the quote, it can be 0 and 20 percent
        /// </summary>
        public decimal VatRate { get; set; } = 0.0m;
        /// <summary>
        /// status of the quote, it can be drafted,  accepted or rejected
        /// </summary>
        public QuoteStatus QuoteStatus { get; set; } = QuoteStatus.Drafted;
        /// <summary>
        /// total amount of the services in the quote including VAT
        /// </summary>
        public decimal TotalAmount { get; set; } = 0.0m;
        /// <summary>
        /// Gets or sets the business identifier by name.
        /// </summary>
        public IdByName? BusinessIdName { get; set; }
        /// <summary>
        /// this field used to implement soft delete functionality, 
        /// </summary>
        public IsDeleted IsDeleted { get; set; } = IsDeleted.Active;
    }
    /// <summary>
    /// this class is used to store the details of a service item in a quote
    /// </summary>
    public class QuoteServiceItem
    {
        /// <summary>
        /// serivce name
        /// </summary>
        public string ServiceName { get; set; } = string.Empty;
        /// <summary>
        /// descrition of the service
        /// </summary>
        public string Description { get; set; } = string.Empty;
        /// <summary>
        /// amount charged for the service
        /// </summary>
        public decimal Amount { get; set; }
    }
    /// <summary>
    /// this class is used to store the id and name of a business
    /// </summary>
    public class IdByName
    {
        /// <summary>
        /// unique identifier for the business
        /// </summary>
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// name of the business
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
    /// <summary>
    /// this class is used to store the first response information
    /// </summary>
    public class FirstResponse
    {
        /// <summary>
        /// unique identifier for the first response    
        /// </summary>
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;
        /// <summary>
        /// firstName of the person who created the first response
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary>
        /// lastName of the person who created the first response
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// date and time when the first response was created
        /// </summary>
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
}
