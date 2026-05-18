import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  // Helper for star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex text-brand-accent text-sm">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
        ))}
        <span className="text-brand-blue ml-1 text-xs">({product.reviews})</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded flex flex-col h-full hover:shadow-lg transition-shadow duration-200 group relative overflow-hidden">
      {/* Dynamic Pricing Badge */}
      <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
         AI Price Optimized
      </div>

      <div 
        className="bg-gray-50 p-4 flex justify-center items-center h-48 rounded-t relative overflow-hidden cursor-pointer"
        onClick={() => onClick && onClick(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full object-contain transform group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1">{renderStars(product.rating)}</div>
        <h3 
          className="text-gray-900 font-medium leading-snug mb-1 hover:text-brand-accent cursor-pointer line-clamp-2"
          onClick={() => onClick && onClick(product)}
        >
          {product.name}
        </h3>
        <div className="text-xs text-gray-500 mb-2">{product.category}</div>
        <div className="mt-auto">
          <div className="flex items-baseline mb-2">
            <span className="text-xs align-top relative top-1">$</span>
            <span className="text-2xl font-bold text-gray-900">{Math.floor(product.price)}</span>
            <span className="text-xs align-top relative top-1">{(product.price % 1).toFixed(2).substring(1)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-brand-accent hover:bg-yellow-500 text-sm py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600 transition-colors btn-rgb text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};