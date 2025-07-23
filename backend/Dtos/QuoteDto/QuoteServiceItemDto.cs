namespace backend.Dtos.QuoteDto
{
    /// <summary>
    /// Represents a data transfer object for a service item in a quote.
    /// </summary>
    
    public class QuoteServiceItemDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
