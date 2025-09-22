import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { PricePipe } from '../../pipes/price.pipe';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TruncatePipe } from "../../pipes/truncate.pipe";

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, CommonModule, TruncatePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
