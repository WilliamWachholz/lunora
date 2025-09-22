export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  //categoryId: number;
  //category?: Category;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  products?: Product[];
}