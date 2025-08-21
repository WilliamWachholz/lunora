using Microsoft.AspNetCore.Mvc;
using LunoraBackend.Models;
using LunoraBackend.DAO;
using Microsoft.EntityFrameworkCore;


namespace LunoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {

        public ProductsController(LunoraContext context)
        {
            _context = context;
        }

        private readonly LunoraContext _context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();

            return Ok(products);
        }

         [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Product _product)
        {
            var product = this._context.Products.FirstOrDefault(o => o.Id == _product.Id);
            if (product != null)
            {                
                product.Price = _product.Price;
                await this._context.SaveChangesAsync();
            }
            else
            {
                this._context.Products.Add(_product);
                await this._context.SaveChangesAsync();
            }

            return Ok(true);
        }
    }

}