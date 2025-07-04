using System.Security.Claims;

namespace backend.helper
{
    public static class ClaimsPrincipalExtensions
    {
     

        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }
        

        public static string GetRole(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Role) ?? string.Empty ; // Default to "User" if role is not set
        }
    }
}
