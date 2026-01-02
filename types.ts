export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  tags: string[];
  isNew?: boolean;
  discount?: number;
  pros: string[];
  cons: string[];
  arModelUrl?: string; // URL to GLB file for 3D view
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  recommendedProducts?: Product[];
  imageData?: string; // Base64 string for user uploaded images
}

export enum ViewState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  CART = 'CART',
  NEW_ARRIVALS = 'NEW_ARRIVALS',
  BEST_SELLERS = 'BEST_SELLERS',
  DEALS = 'DEALS',
  GIFT_CARDS = 'GIFT_CARDS',
  SELL = 'SELL',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL'
}

export interface User {
  name: string;
  isLoggedIn: boolean;
}