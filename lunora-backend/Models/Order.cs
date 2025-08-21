using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LunoraBackend.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        public string ShippingAddress { get; set; }

         [Required]
        public string PaymentInfo { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        public DateTime? UpdatedAt { get; set; }
    }

    public enum OrderStatus
    {
        Pending,
        Processing,
        Shipped,
        Delivered,
        Cancelled,
        Refunded
    }
}