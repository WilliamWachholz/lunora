import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { CartItem } from '../../../shared/models/cart-item.model';
import { Product } from '../../../shared/models/product.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [ CommonModule, RouterLink  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.productId);
  }

  updateQuantity(item: CartItem, quantity: number): void {
 
    // Do this:
    this.productService.getProduct(item.productId).subscribe({
      next: (product) => {
        if (quantity < product.stockQuantity) {
          this.cartService.updateQuantity(item.productId, quantity);
        }        
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });

   
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}