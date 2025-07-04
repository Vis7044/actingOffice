using backend.Dtos.UserDto;
using backend.Models;
using FluentValidation;

namespace backend.Validator
{
    public class UserValidator: AbstractValidator<RegisterUserDto>
    {
        public UserValidator()
        {
            RuleFor(user => user.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .Length(2, 50).WithMessage("First name must be between 2 and 50 characters.");
            RuleFor(user => user.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .Length(2, 50).WithMessage("Last name must be between 2 and 50 characters.");
            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");
            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
            RuleFor(user => user.DateOfBirth)
                .LessThan(DateTime.Now).WithMessage("Date of birth must be in the past.");
        }
    }
}
