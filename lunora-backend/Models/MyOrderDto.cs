using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LunoraBackend.Models
{
    public class MyOrderDto
    {
        public string Number { get; set; }

        public DateTime CreatedAt { get; set; }

        public decimal Total { get; set; }
        
        public string Status{ get; set; }
    }

}