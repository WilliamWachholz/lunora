import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order.model';
import { environment } from '../../../environments/environment';
import { MyOrder } from '../../shared/models/my-order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create`, order);
  }

  
  getMyOrders(): Observable<MyOrder[]> {
    return this.http.get<MyOrder[]>(`${this.apiUrl}/myorders`);
  }
}