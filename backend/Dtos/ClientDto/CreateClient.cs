using backend.Enums;
using backend.Models;

namespace backend.Dtos.ClientDto
{
    /// <summary>
    /// this class is used to create a new client,
    /// </summary>
    public class CreateClient
    {
        /// <summary>
        /// Gets or sets the name of the business.
        /// </summary>
        public string BusinessName { get; set; } = string.Empty;
        /// <summary>
        /// enum to store the type of the business, 
        /// </summary>
        public BusinessType Type { get; set; } =BusinessType.Individual;
        /// <summary>
        /// address of the client,
        /// </summary>
        public ClientAddress? Address { get; set; }
        /// <summary>
        /// soft delete functionality,
        /// </summary>
        public IsDeleted IsDeleted { get; set; } = IsDeleted.Active;

    }
}
