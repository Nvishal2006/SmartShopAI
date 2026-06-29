import React, { useMemo, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, SearchX, Sparkles, ShoppingBag } from 'lucide-react';

interface HomeProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  filteredProducts: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onOpenChat: () => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export const Home: React.FC<HomeProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  filteredProducts,
  onAddToCart,
  onProductClick,
  onOpenChat
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc': return products.sort((a, b) => a.price - b.price);
      case 'price-desc': return products.sort((a, b) => b.price - a.price);
      case 'rating': return products.sort((a, b) => b.rating - a.rating);
      case 'featured': default: return products;
    }
  }, [filteredProducts, sortBy]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-mesh h-[620px] overflow-hidden flex items-center justify-center">
        {/* Hero Background Image Overlay */}
        <img 
          src="/3d-retail.png" 
          alt="Futuristic 3D Retail Scene" 
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none transition-transform duration-[15s] scale-102 hover:scale-108"
        />
        {/* Glow Spheres */}
        <div className="absolute top-12 left-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-12 right-1/4 w-[450px] h-[450px] bg-cyan-600/15 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite_2s]"></div>
        
        {/* Diagonal Light Beam */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

        {/* Ambient Dark Overlay to fade out to content */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/100 z-0 pointer-events-none"></div>
        
        <div className="relative container mx-auto px-4 text-center z-10 mt-[-30px]">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white font-bold tracking-[0.25em] text-[10px] uppercase shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] mb-8"
          >
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]"></span>
              Intelligent retail ecosystem
          </motion.div>
          <motion.h1 
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl"
          >
            The Future of Retail <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">is Here</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg md:text-2xl max-w-3xl mx-auto mb-14 font-normal leading-relaxed opacity-90 px-4"
          >
            Experience the seamless integration of AI shopping assistance, interactive 3D/AR previewing, and virtual try-on technology.
          </motion.p>
          <motion.div 
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
              <button onClick={onOpenChat} className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accentHover text-white font-bold py-4 px-12 rounded-full transition-all shadow-[0_10px_20px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 btn-rgb">
                 <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" /> Chat with AI
              </button>
              <button 
                  onClick={() => window.scrollTo({ top: 720, behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-12 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                  <ShoppingBag className="w-5 h-5" /> Browse Catalog
              </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
             <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200 sticky top-24">
               <div className="flex items-center gap-2 mb-6">
                 <Filter className="w-5 h-5 text-brand-accent" />
                 <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
               </div>
               
               <div className="mb-6">
                 <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider">Categories</h4>
                 <div className="space-y-2">
                   {categories.map(cat => (
                     <label key={cat} className="flex items-center group cursor-pointer p-2 hover:bg-brand-accent/5 rounded-lg transition-colors">
                       <input
                         type="radio"
                         name="category"
                         checked={selectedCategory === cat}
                         onChange={() => setSelectedCategory(cat)}
                         className="text-brand-accent focus:ring-brand-accent h-4 w-4 border-gray-300"
                       />
                       <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-brand-dark transition-colors">{cat}</span>
                     </label>
                   ))}
                 </div>
               </div>

               <hr className="my-6 border-gray-100"/>

               <div>
                 <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-accent" />
                    Price Range
                 </h4>
                 <div className="px-2">
                   <input 
                     type="range" 
                     min="0" 
                     max="2000" 
                     step="50"
                     value={maxPrice}
                     onChange={(e) => setMaxPrice(Number(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                   />
                   <div className="flex justify-between text-sm font-medium text-gray-500 mt-4">
                     <span>$0</span>
                     <span className="text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-md">${maxPrice}</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-grow">
             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
               <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                 {selectedCategory === 'All' ? 'Featured Recommendations' : selectedCategory} 
                 <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                   {filteredProducts.length}
                 </span>
               </h2>
               
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Sort by:</span>
                 <select 
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value as SortOption)}
                   className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block w-full p-2.5 outline-none transition-colors"
                 >
                   <option value="featured">Featured</option>
                   <option value="price-asc">Price: Low to High</option>
                   <option value="price-desc">Price: High to Low</option>
                   <option value="rating">Highest Rated</option>
                 </select>
               </div>
             </div>
             
             {sortedProducts.length > 0 ? (
               <motion.div 
                 layout
                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
               >
                 <AnimatePresence>
                    {sortedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <ProductCard 
                          product={product} 
                          onAddToCart={onAddToCart} 
                          onClick={onProductClick} 
                        />
                      </motion.div>
                    ))}
                 </AnimatePresence>
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white p-16 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center border border-dashed border-gray-300 min-h-[400px]"
               >
                 <SearchX className="w-16 h-16 text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                 <p className="text-gray-500 mb-6 max-w-md">We couldn't find anything matching your current filters. Try adjusting your price range or category.</p>
                 <button 
                    onClick={() => {setSelectedCategory('All'); setMaxPrice(2000)}} 
                    className="bg-brand-accent/10 text-brand-accent font-bold py-2 px-6 rounded-full hover:bg-brand-accent/20 transition-colors"
                 >
                    Reset Filters
                 </button>
               </motion.div>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
