import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [ CurrencyPipe, CommonModule, FormsModule ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductDetailsComponent implements OnInit {
  product: Product | undefined
  quantity = 1;
  loading = true;
  error = false;

  private toastr = inject(ToastrService);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      this.productService.getProduct(+productId).subscribe({
        next: (product) => {                    
          this.product = product;
          this.loading = false;
          console.log(product.name);
        },
        error: (error) => {
          this.error = true;
          this.loading = false;
          this.toastr.error('Failed to load product details. ' + error);
        },
        complete: () => {
          this.loading = false;

          this.cdr.detectChanges(); // Force change detection
        }   
      });
    }
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.toastr.success(`${this.quantity} ${this.product.name} added to cart`);
      // Optional: Reset quantity after adding to cart
      this.quantity = 1;
    }
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newQuantity = parseInt(input.value, 10);
    
    if (this.product) {
      // Validate quantity
      if (isNaN(newQuantity)) {
        newQuantity = 1;
      } else if (newQuantity < 1) {
        newQuantity = 1;
      } else if (newQuantity > this.product.stockQuantity) {
        newQuantity = this.product.stockQuantity;
      }
      
      this.quantity = newQuantity;
      input.value = newQuantity.toString();
    }
  }
}