    namespace backend.Dtos.QuoteDto
{
    public class QuoteSummaryDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public int TotalCount { get; set; }
        public int AcceptedCount { get; set; }
        public int DraftCount { get; set; }
        public int RejectedCount { get; set; }
    }

    public class DailyQuoteSummary
    {
        public string _id { get; set; }
        public int total { get; set; }
    }

    public class DailyQouteAmountSalary
    {

        public string DraftCountAmount { get; set; } = string.Empty;
        public string AcceptedCountAmount { get; set; } = string.Empty;
        public string TotalCountAmount { get; set; } = string.Empty;

        public string RejectedCountAmount { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;
    }
}
