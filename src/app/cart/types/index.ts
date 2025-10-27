export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  quantity: number;
  total_price: number;
}

export interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  isOrdering: boolean;
  onCheckout: () => void;
}

export interface CartItemProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}
