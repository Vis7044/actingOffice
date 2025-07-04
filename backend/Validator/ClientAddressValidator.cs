using backend.Dtos.ClientDto;
using FluentValidation;

namespace backend.Validator
{
    public class ClientAddressValidator : AbstractValidator<ClientAddressDto>
    {
        public ClientAddressValidator() {
            RuleFor(x => x.Street)
                .NotEmpty().WithMessage("Street is required.")
                .Length(2, 100).WithMessage("Street must be between 2 and 100 characters.");
            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required.")
                .Length(2, 50).WithMessage("City must be between 2 and 50 characters.");
            RuleFor(x => x.State)
                .NotEmpty().WithMessage("State is required.")
                .Length(2, 50).WithMessage("State must be between 2 and 50 characters.");
            RuleFor(x => x.PinCode)
                .NotEmpty().WithMessage("PinCode is required.")
                .Matches(@"^\d{6}$").WithMessage("PinCode must be a 6-digit number.");
            RuleFor(x => x.Country)
                .NotEmpty().WithMessage("Country is required.")
                .Length(2, 50).WithMessage("Country must be between 2 and 50 characters.");

        }
    }
}
