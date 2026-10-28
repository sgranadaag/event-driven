export interface Order {
  id: string;
  product: string;
  quantity: number;
}

export interface OrderPriority {
  id: string;
  priority: string;
  region: string;
}
