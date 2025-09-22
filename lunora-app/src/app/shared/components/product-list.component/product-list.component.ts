import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from "../product-card.component/product-card.component";
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCardComponent, FormsModule, FilterPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  searchQuery = '';
  showLoadingMessage = false;
  private loadingTimer: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.showLoadingMessage = false;

    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }

     this.loadingTimer = setTimeout(() => {
      if (this.isLoading) {
        this.showLoadingMessage = true;
        this.cdr.detectChanges(); 
      }
    }, 5000);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        this.showLoadingMessage = false;
        this.clearLoadingTimer();
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading = false;
        this.showLoadingMessage = false;
        this.clearLoadingTimer();
      },
        complete: () => {
          this.isLoading = false;
          this.showLoadingMessage = false;
          this.clearLoadingTimer();
          this.cdr.detectChanges(); // Force change detection
        }   
    });
  }

  private clearLoadingTimer(): void {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = null;
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  ngOnDestroy(): void {
    this.clearLoadingTimer();
  }
}
