using backend.Dtos.ClientDto;

namespace backend.Models
{
    /// <summary>
    /// this class is used to represent a client model with its associated history and users.
    /// </summary>
    public class ClientModelWithHistory
    {
        /// <summary>
        /// this field stores the details of the client.
        /// </summary>
        public ClientModel Client { get; set; }
        /// <summary>
        /// this field stores the list of history associated with the client.
        /// </summary>
        public List<HistoryWithUser> HistoryWithUsers { get; set; }


    }
}
