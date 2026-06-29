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
      <div className="flex text-brand-gold text-sm items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
        ))}
        <span className="text-gray-400 ml-1.5 text-xs">({product.reviews})</span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl flex flex-col h-full card-glow-hover hover-shimmer group relative overflow-hidden shadow-sm">
      {/* Dynamic Pricing Badge */}
      <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
         AI Price Optimized
      </div>

      <div 
        className="bg-gradient-to-b from-gray-50 to-gray-100/30 p-4 flex justify-center items-center h-48 rounded-t-3xl relative overflow-hidden cursor-pointer"
        onClick={() => onClick && onClick(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-[85%] object-contain transform group-hover:scale-108 transition-transform duration-500 ease-out mix-blend-multiply drop-shadow-md"
          loading="lazy"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">{renderStars(product.rating)}</div>
        <h3 
          className="text-gray-900 font-bold text-base leading-snug mb-1 hover:text-brand-accent cursor-pointer line-clamp-2 transition-colors"
          onClick={() => onClick && onClick(product)}
        >
          {product.name}
        </h3>
        <div className="text-[11px] text-gray-400 font-medium tracking-wide uppercase mb-3">{product.category}</div>
        <div className="mt-auto">
          <div className="flex items-baseline mb-4">
            <span className="text-sm font-bold text-gray-900 align-top">$</span>
            <span className="text-3xl font-black text-brand-dark tracking-tight">{Math.floor(product.price)}</span>
            <span className="text-sm font-bold text-gray-900 align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-brand-dark text-white hover:bg-brand-accent text-xs font-bold py-3 rounded-xl shadow-md transition-all duration-300 focus:outline-none transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};