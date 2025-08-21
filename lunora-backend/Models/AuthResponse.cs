using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LunoraBackend.Models
{
    public class AuthResponse
    {
        public string Token { get; set; }
        
        public User User{ get; set; }
    }
}