import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MyOrder } from '../../models/my-order.model';
import { OrderService } from '../../../core/services/order.service';
 


@Component({
  selector: 'app-order-list.component',
  imports: [ CommonModule ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {
  Orders: MyOrder[] = [];  

  constructor(    
    private router: Router,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.Orders = orders;
      },
      error: (err) => {
        console.error('Failed to load orders', err);        
      },
        complete: () => {
        this.cdr.detectChanges(); 
        }   
    });

  }

  formatDate(date: Date): string {
    // Handle null/undefined
  if (!date) return 'N/A';
  
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if it's a valid Date object
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.warn('Invalid date value:', date);
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}