using System.Security.Claims;

namespace backend.helper
{
    public static class ClaimsPrincipalExtensions
    {

        /// <summary>
        /// returns the user id from the claims principal
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        }

        /// <summary>
        /// returns the role of the user from the claims principal
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static string GetRole(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Role) ?? string.Empty ; // Default to "User" if role is not set
        }
    }
}
