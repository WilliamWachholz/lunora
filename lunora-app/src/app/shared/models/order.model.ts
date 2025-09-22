export interface Order {
  shippingAddress: string;
  paymentInfo: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}
