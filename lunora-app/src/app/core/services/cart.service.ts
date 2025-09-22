import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../../shared/models/cart-item.model';
import { Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItems.next(JSON.parse(cart));
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity
      });
    }
    
    this.saveCart(currentItems);
  }

  removeFromCart(productId: number): void {
    const items = this.cartItems.value.filter(item => item.productId !== productId);
    this.saveCart(items);
  }

  updateQuantity(productId: number, quantity: number): void {
    const items = this.cartItems.value.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  }
}