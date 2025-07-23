    namespace backend.Dtos.QuoteDto
{
    /// <summary>
    /// dto for summarizing quotes of a user.
    /// </summary>
    public class QuoteSummaryDto
    {
        /// <summary>
        /// stores the user first name
        /// </summary>
        public string FirstName { get; set; } = string.Empty;
        /// <summary>
        /// stores the user last name
        /// </summary>
        public string LastName { get; set; } = string.Empty;
        /// <summary>
        /// stores the total count of quotes created by the user.
        /// </summary>
        public int TotalCount { get; set; }
        /// <summary>
        /// stores the count of quotes accepted of the user.
        /// </summary>
        public int AcceptedCount { get; set; }
        /// <summary>
        /// stores the count of quotes in draft state of the user.
        /// </summary>
        public int DraftCount { get; set; }
        /// <summary>
        /// stores the count of quotes rejected of the user.
        /// </summary>
        public int RejectedCount { get; set; }
    }
    /// <summary>
    /// stores the day and total count of quotes created by the user on that day.
    /// </summary>
    public class DailyQuoteSummary
    {
        /// <summary>
        /// stores the day of a month
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// stores the total count of quotes created by the user on that day.
        /// </summary>
        public int total { get; set; }
    }
    /// <summary>
    /// Represents the daily statistics for quote amounts, including draft, accepted, rejected, and total counts.
    /// </summary>
    public class DailyQouteAmountStats
    {
        /// <summary>
        /// Stores the Total Amount of quotes created of the user on that day.
        /// </summary>
        public string DraftCountAmount { get; set; } = string.Empty;
        /// <summary>
        /// stores the Total Amount of quotes accepted of the user on that day.
        /// </summary>

        public string AcceptedCountAmount { get; set; } = string.Empty;
        /// <summary>
        /// stores the Total Amount of quotes rejected of the user on that day.
        /// </summary>
        public string TotalCountAmount { get; set; } = string.Empty;
        /// <summary>
        /// stores the Total Amount of quotes rejected of the user on that day.
        /// </summary>

        public string RejectedCountAmount { get; set; } = string.Empty;
        /// <summary>
        /// stores the name of the user that created the quotes.
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
}
