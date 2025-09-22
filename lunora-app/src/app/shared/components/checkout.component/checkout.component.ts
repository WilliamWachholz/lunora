import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../shared/models/cart-item.model';
import { OrderService } from '../../../core/services/order.service';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderItem } from '../../models/order.model';
import { CartModule } from '../../../features/cart.module';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  imports: [ FormsModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];  
  isLoading: boolean = false;
  total: number = 0;
  tax: number = 0;

    private toastr = inject(ToastrService)

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      phone: ['', Validators.required],
      cardName: ['', Validators.required],
      cardNumber: ['', Validators.required],
      cardExpiry: ['', Validators.required],
      cardCvv: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.calculateTotals();
  }

  loadCartItems(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items
    });
  }

  calculateTotals(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.tax = this.total * 0.08; // 8% tax rate
  }

  getOrderItems(): OrderItem[] {
    return this.cartItems.map(cartItem => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      unitPrice: cartItem.price
    }));
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found!');
      // Redirect to login or show error
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;

    const { firstName, lastName, address, city, state, zipCode, cardName, cardNumber, cardExpiry, cardCvv } = this.checkoutForm.value;

    const order: Order = {
      shippingAddress: `Ship To: ${firstName} ${lastName}. Address: ${address}, ${city}/${state} - ${zipCode}`,
      paymentInfo: `Card Name: ${cardName}. CardNumber: ${cardNumber}. Expires: ${cardExpiry}. CVV: ${cardCvv}`,
      orderItems: this.getOrderItems()
    }
     
    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation']);
      },
      error: (error) => {
        this.toastr.error(error.message || 'Order failed');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    }); 
      
  }

  
  hasError(controlName: string, errorType: string): boolean {
    const control = this.checkoutForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}