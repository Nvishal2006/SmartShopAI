import React, { useState } from 'react';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ArrowLeft, Box, Shirt, ThumbsUp, ThumbsDown, Star, MessageSquare } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onOpenAR: () => void;
  onOpenTryOn: () => void;
  relatedProducts: Product[];
  onProductClick: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  onOpenAR,
  onOpenTryOn,
  relatedProducts,
  onProductClick
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto p-6 relative pb-24"
    >
      <button 
        onClick={onBack} 
        className="mb-6 text-gray-500 hover:text-brand-accent flex items-center gap-2 font-medium transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Browse
      </button>
      
      <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 overflow-hidden flex flex-col md:flex-row mb-12">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center relative">
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-[450px] max-w-full object-contain mix-blend-multiply shadow-sm z-10 drop-shadow-xl" 
          />
          
          {/* AR / 3D Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-4 z-20"
          >
            <button 
              onClick={onOpenAR}
              className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:border-brand-accent/30 transition-all text-sm font-bold text-gray-700 hover:text-brand-accent group"
            >
              <Box className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" /> View in 3D
            </button>
            <button 
              onClick={onOpenTryOn}
              className="flex items-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:border-brand-accent/30 transition-all text-sm font-bold text-gray-700 hover:text-brand-accent group"
            >
              <Shirt className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" /> Virtual Try-On
            </button>
          </motion.div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="text-brand-accent font-bold uppercase tracking-wider text-sm bg-brand-accent/10 px-3 py-1 rounded-full">{product.category}</div>
            
            {/* Dynamic Pricing Indicator */}
            <div className="flex flex-col items-end bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Demand: High
              </div>
              <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-[80%] relative">
                   <div className="absolute inset-0 bg-white/30 animate-[slide-in-right_1s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-4xl font-black text-brand-dark tracking-tight">${product.price}</span>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex flex-col">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-500 text-sm font-medium mt-1">{product.reviews} verified reviews</span>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Product Details
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'reviews' ? 'border-brand-accent text-brand-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare className="w-4 h-4" /> Reviews
            </button>
          </div>

          {activeTab === 'details' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow">
              <p className="text-gray-600 leading-relaxed text-lg mb-8">{product.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                  <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5" /> Pros
                  </h3>
                  <ul className="space-y-2">
                    {product.pros?.map((pro, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span> {pro}
                      </li>
                    )) || <li className="text-gray-400 italic">No pros listed</li>}
                  </ul>
                </div>
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                  <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5" /> Cons
                  </h3>
                  <ul className="space-y-2">
                    {product.cons?.map((con, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span> {con}
                      </li>
                    )) || <li className="text-gray-400 italic">No cons listed</li>}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow space-y-6 max-h-[400px] overflow-y-auto pr-2">
               {/* Mock Reviews */}
               {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                       U{i}
                     </div>
                     <div>
                       <div className="font-bold text-sm text-gray-900">User {i}</div>
                       <div className="flex text-yellow-400">
                         {[...Array(5)].map((_, j) => (
                           <Star key={j} className={`w-3 h-3 ${j < 4 ? 'fill-current' : 'text-gray-300'}`} />
                         ))}
                       </div>
                     </div>
                   </div>
                   <p className="text-gray-600 text-sm">"Great product! The quality is amazing and it arrived really fast. Highly recommend checking out the AR view before buying."</p>
                 </div>
               ))}
            </motion.div>
          )}

          <div className="mt-auto pt-8">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-accent text-white font-bold text-lg py-4 rounded-xl shadow-[0_10px_20px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(124,58,237,0.6)] hover:bg-brand-accentHover transition-all transform active:scale-[0.98] btn-rgb"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            You might also like
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
            {relatedProducts.map(rp => (
              <div key={rp.id} className="min-w-[280px] w-[280px] flex-shrink-0 snap-start cursor-pointer group" onClick={() => onProductClick(rp)}>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="h-48 bg-gray-50 rounded-xl mb-4 p-4 flex items-center justify-center overflow-hidden">
                    <img src={rp.imageUrl} alt={rp.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{rp.name}</h3>
                  <div className="text-brand-accent font-bold mt-2">${rp.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
