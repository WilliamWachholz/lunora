using Microsoft.AspNetCore.Mvc;
using LunoraBackend.Models;
using LunoraBackend.DAO;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace LunoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {        
        private readonly LunoraContext _context;

        public OrdersController(LunoraContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] OrderDto _orderDto)
        {
            if (User.Identity == null)
            {
                return BadRequest("User.Identity is null - authentication not working");
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("User is not authenticated");
            }

            // Check if ClaimsPrincipal is populated
            if (User.Claims == null)
            {
                return BadRequest("User.Claims is null - check authentication middleware");
            }

            // Now check if we have any claims
            if (!User.Claims.Any())
            {
                return BadRequest("User authenticated but has no claims");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("nameidentifier")  // lowercase               
                ?? User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            var order = new Order();

            order.UserId = userId;
            order.ShippingAddress = _orderDto.ShippingAddress;
            order.PaymentInfo = _orderDto.PaymentInfo;
            order.OrderItems = _orderDto.OrderItems.Select(r => new OrderItem() { ProductId = r.ProductId, Quantity = r.Quantity, UnitPrice = r.UnitPrice }).ToList();
            order.OrderDate = DateTime.UtcNow;
            order.Status = OrderStatus.Pending;
            order.TotalAmount = order.OrderItems.Sum(r => r.UnitPrice * r.Quantity);
            order.TotalAmount = order.TotalAmount + (order.TotalAmount * 0.08m); // 8% tax rate

            this._context.Orders.Add(order);

            order.OrderItems.Select(r => r.OrderId = order.Id).ToList();

            this._context.OrderItem.AddRange(order.OrderItems);

            await this._context.SaveChangesAsync();

            return Ok(true);
        }



        [HttpGet("myorders")]
        public async Task<ActionResult<IEnumerable<MyOrderDto>>> GetMyOrders()
        {
             if (User.Identity == null)
            {
                return BadRequest("User.Identity is null - authentication not working");
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("User is not authenticated");
            }

            // Check if ClaimsPrincipal is populated
            if (User.Claims == null)
            {
                return BadRequest("User.Claims is null - check authentication middleware");
            }

            // Now check if we have any claims
            if (!User.Claims.Any())
            {
                return BadRequest("User authenticated but has no claims");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub")
                ?? User.FindFirstValue("nameidentifier")  // lowercase               
                ?? User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .OrderByDescending(o => o.Id)
                    .ToListAsync();
            
            var myOrders = orders.Select(r => new MyOrderDto() { Number = r.Id.ToString("ORD-000"), CreatedAt = r.OrderDate, Total = r.TotalAmount, Status = r.Status.ToString() }).ToList();

            return Ok(myOrders);
        }

    }
}