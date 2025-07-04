using backend.Dtos.UserDto;
using FluentValidation;

namespace backend.Validator
{
    public class LoginValidator : AbstractValidator<LoginDto>
    {
        public LoginValidator() 
        {
            // Define validation rules for login
            RuleFor(login => login.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(login => login.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
        }
    }
}
