using MongoDB.Bson.Serialization.Attributes;

namespace backend.Dtos.ClientDto
{
    public class ClientAddressDto
    {
        /// <summary>
        /// stores the building name or number, 
        /// </summary>
        public string Building { get; set; } = string.Empty;
        /// <summary>
        /// stores the street name or number, 
        /// </summary>
        public string Street { get; set; } = string.Empty;
        /// <summary>
        /// stores the city name,
        /// </summary>
        public string City { get; set; } = string.Empty;
        /// <summary>
        /// stores the state or region name
        /// </summary>
        public string State { get; set; } = string.Empty;
        /// <summary>
        /// PinCode` is a string to accommodate alphanumeric postal codes
        /// </summary>
        public string PinCode { get; set; } = string.Empty;
        /// <summary>
        /// stores the country name
        /// </summary>
        public string Country { get; set; } = string.Empty;

    }
}
