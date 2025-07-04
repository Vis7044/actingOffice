using backend.Dtos.ClientDto;
using FluentValidation;

namespace backend.Validator
{
    public class ClientValidator : AbstractValidator<CreateClient>
    {
        public ClientValidator()
        {
            //    // Define validation rules for client creation
            //    RuleFor(client => client.ClientId)
            //        .NotEmpty().WithMessage("Client ID is required.")
            //        .Length(1, 50).WithMessage("Client ID must be between 1 and 50 characters.");
            //    RuleFor(client => client.BusinessName)
            //        .NotEmpty().WithMessage("Business Name is required.")
            //        .Length(2, 100).WithMessage("Business Name must be between 2 and 100 characters.");
            //    RuleFor(client => client.Type)
            //        .IsInEnum().WithMessage("Invalid business type.");
            //    RuleFor(client => client.Address)
            //        .SetValidator(new ClientAddressValidator());
            //}
        }
    }
}
