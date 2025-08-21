using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LunoraBackend.Models
{
    public class OrderDto
    {
        [Required]
        public string ShippingAddress { get; set; }

        [Required]
        public string PaymentInfo { get; set; }

        public ICollection<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();

    }

    public class OrderItemDto
    { [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

    }
 
}