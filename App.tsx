import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ChatInterface } from './components/ChatInterface';
import { SignIn } from './components/SignIn';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, ViewState, User } from './types';

// Polyfill for model-viewer types
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        poster?: string;
        alt?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        exposure?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        ar?: boolean;
        loading?: string;
        [key: string]: any;
      };
    }
  }
}

const App: React.FC = () => {
  // Application State
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTriggerMessage, setChatTriggerMessage] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User>({ name: 'Guest', isLoggedIn: false });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals State
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [stickerPos, setStickerPos] = useState({ x: 50, y: 50 }); // Percentage

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  // Derived State (Filtered Products for HOME)
  const categories = useMemo(() => ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))], []);
  
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      return matchesCategory && matchesPrice;
    });
  }, [selectedCategory, maxPrice]);

  // Handlers
  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentView(ViewState.PRODUCT_DETAIL);
    window.scrollTo(0, 0);
  }, []);

  const handleLoginClick = () => {
    if (user.isLoggedIn) {
      setUser({ name: 'Guest', isLoggedIn: false });
    } else {
      setCurrentView(ViewState.LOGIN);
    }
  };

  const handleSignIn = (name: string) => {
    setUser({ name, isLoggedIn: true });
    setCurrentView(ViewState.HOME);
  };

  const handleSearchSubmit = (term: string) => {
      if(!term) return;

      const matches = MOCK_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(term.toLowerCase()) || 
          p.category.toLowerCase().includes(term.toLowerCase())
      );

      if (matches.length > 0) {
          setCurrentView(ViewState.HOME);
          setSelectedCategory('All');
      } else {
          setIsChatOpen(true);
          const msg = `I noticed you're looking for "${term}". We don't have it in stock right now, but I can ask management to arrange it within 3 days! Shall I show you similar items?`;
          setChatTriggerMessage(msg);
          setTimeout(() => setChatTriggerMessage(undefined), 1000);
      }
  };

  // Try On Handler
  const handleTryOnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setUserPhoto(reader.result as string);
          reader.readAsDataURL(file);
      }
  }

  // Simple drag logic for sticker
  const handleDrag = (e: React.MouseEvent) => {
      setStickerPos({
          x: Math.min(80, Math.max(10, stickerPos.x + (Math.random() - 0.5) * 5)),
          y: Math.min(80, Math.max(10, stickerPos.y + (Math.random() - 0.5) * 5))
      })
  }

  // RENDERERS FOR NEW PAGES

  const renderNewArrivals = () => (
    <div className="container mx-auto p-6 animate-fade-in">
        <div className="bg-brand-accent text-white p-8 rounded-2xl mb-8 relative overflow-hidden shadow-lg">
            <div className="absolute -right-10 -top-10 bg-white opacity-10 w-64 h-64 rounded-full blur-3xl"></div>
            <h1 className="text-4xl font-bold relative z-10">Fresh Drops</h1>
            <p className="relative z-10 mt-2 opacity-90">Be the first to own the latest tech and trends.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.filter(p => p.isNew || Math.random() > 0.7).map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onClick={handleProductClick} />
            ))}
        </div>
    </div>
  );

  const renderBestSellers = () => (
      <div className="container mx-auto p-6 animate-fade-in">
          <div className="bg-gradient-to-r from-yellow-500 to-brand-gold p-8 rounded-2xl mb-8 text-white shadow-lg">
              <h1 className="text-4xl font-bold">Community Favorites</h1>
              <p className="mt-2">Top rated products loved by thousands.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.filter(p => p.rating >= 4.7).map(p => (
                  <div key={p.id} className="relative">
                      <div className="absolute -top-2 -left-2 z-10 bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">#1 Best Seller</div>
                      <ProductCard product={p} onAddToCart={handleAddToCart} onClick={handleProductClick} />
                  </div>
              ))}
          </div>
      </div>
  );

  const renderDeals = () => (
    <div className="container mx-auto p-6 animate-fade-in">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 rounded-2xl mb-8 text-white shadow-lg flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold">Flash Deals</h1>
                <p className="mt-2">Limited time offers. Don't miss out!</p>
            </div>
            <div className="text-4xl animate-pulse">⚡</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map(p => {
                const discount = p.discount || (Math.random() > 0.5 ? 15 : 0);
                if (discount === 0) return null;
                return (
                    <div key={p.id} className="relative">
                        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">-{discount}%</div>
                        <ProductCard product={{...p, price: p.price * (1 - discount/100)}} onAddToCart={handleAddToCart} onClick={handleProductClick} />
                        <div className="mt-2 text-center text-sm text-gray-400 line-through">Was: ${p.price.toFixed(2)}</div>
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderGiftCards = () => (
      <div className="container mx-auto p-6 animate-fade-in flex flex-col items-center">
          <h1 className="text-3xl font-bold text-brand-dark mb-8">Give the Perfect Gift</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
              {['$25', '$50', '$100'].map((val, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-brand-dark to-brand-light rounded-xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group">
                      <div className="absolute inset-0 bg-brand-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <div className="text-xl mb-12 font-mono tracking-widest">SmartShopAi</div>
                      <div className="text-4xl font-bold mb-4">{val}</div>
                      <div className="flex justify-between items-end">
                          <div className="text-sm opacity-75">Gift Card</div>
                          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderSell = () => (
      <div className="animate-fade-in">
          <div className="bg-brand-dark text-white py-20 px-6 text-center">
              <h1 className="text-5xl font-bold mb-6">Sell on SmartShopAi</h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">Reach millions of customers with the power of AI-driven product discovery.</p>
              <button className="bg-brand-accent hover:bg-brand-accentHover text-white text-lg font-bold px-8 py-3 rounded-full shadow-lg transition-all transform hover:-translate-y-1 btn-rgb">Start Selling</button>
          </div>
      </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="container mx-auto p-6 animate-slide-up relative">
         <button 
           onClick={() => setCurrentView(ViewState.HOME)} 
           className="mb-6 text-gray-500 hover:text-brand-accent flex items-center gap-2 font-medium"
         >
           ← Back to Browse
         </button>
         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center relative">
               <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-[400px] max-w-full object-contain mix-blend-multiply shadow-sm z-10" />
               
               {/* AR / 3D Buttons */}
               <div className="mt-6 flex gap-4 z-20">
                  <button 
                    onClick={() => { setIsAROpen(true); }}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <span className="text-lg">🧊</span> View in 3D
                  </button>
                  <button 
                    onClick={() => { setUserPhoto(null); setIsTryOnOpen(true); }}
                    className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <span className="text-lg">👕</span> Virtual Try-On
                  </button>
               </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
               <div className="flex justify-between items-start">
                  <div className="text-brand-accent font-bold uppercase tracking-wider text-sm mb-2">{selectedProduct.category}</div>
                  {/* Dynamic Pricing Indicator */}
                  <div className="flex flex-col items-end">
                     <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <span className="animate-pulse">●</span> Live Demand: High
                     </div>
                     <div className="w-20 h-1 bg-gray-200 rounded mt-1 overflow-hidden">
                        <div className="h-full bg-green-500 w-[80%] animate-pulse"></div>
                     </div>
                  </div>
               </div>

               <h1 className="text-4xl font-bold text-brand-dark mb-4">{selectedProduct.name}</h1>
               <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">${selectedProduct.price}</span>
                  <div className="flex text-yellow-400 text-lg">
                    {'★'.repeat(Math.round(selectedProduct.rating))}
                    <span className="text-gray-300">{'★'.repeat(5 - Math.round(selectedProduct.rating))}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({selectedProduct.reviews} reviews)</span>
               </div>
               
               <p className="text-gray-600 leading-relaxed text-lg mb-8">{selectedProduct.description}</p>

               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold text-green-600 mb-3 flex items-center gap-2">
                      <span className="bg-green-100 p-1 rounded-full">👍</span> Pros
                    </h3>
                    <ul className="space-y-2">
                      {selectedProduct.pros?.map((pro, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span> {pro}
                        </li>
                      )) || <li className="text-gray-400 italic">No pros listed</li>}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-500 mb-3 flex items-center gap-2">
                      <span className="bg-red-100 p-1 rounded-full">👎</span> Cons
                    </h3>
                    <ul className="space-y-2">
                      {selectedProduct.cons?.map((con, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span> {con}
                        </li>
                      )) || <li className="text-gray-400 italic">No cons listed</li>}
                    </ul>
                  </div>
               </div>

               <div className="mt-auto pt-8 border-t border-gray-100">
                 <button 
                   onClick={() => handleAddToCart(selectedProduct)}
                   className="w-full bg-brand-accent text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-brand-accentHover transition-all transform active:scale-[0.98] btn-rgb"
                 >
                   Add to Cart
                 </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  const renderCart = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return (
      <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-brand-dark">Shopping Cart</h2>
        {cart.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
              <div className="text-6xl mb-4 grayscale opacity-50">🛒</div>
              <p className="text-xl text-gray-600 mb-4">Your SmartShop cart is empty.</p>
              <button 
                onClick={() => setCurrentView(ViewState.HOME)} 
                className="bg-brand-accent text-white px-8 py-3 rounded-full hover:bg-brand-accentHover transition-colors shadow-lg font-bold btn-rgb"
              >
                Start Shopping
              </button>
            </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  {cart.map(item => (
                      <div key={item.id} className="flex gap-6 border-b border-gray-100 py-6 last:border-0 items-center relative group">
                          <div className="bg-gray-50 p-2 rounded-lg w-24 h-24 flex items-center justify-center">
                            <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply"/>
                          </div>
                          <div className="flex-grow">
                              <h3 className="font-medium text-lg text-brand-dark">{item.name}</h3>
                              <div className="text-sm text-brand-secondary font-medium mt-1">In Stock</div>
                              <div className="flex items-center mt-2">
                                <span className="text-xs text-gray-500 mr-2">Qty:</span>
                                <span className="font-bold bg-gray-100 px-2 py-0.5 rounded">{item.quantity}</span>
                              </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="font-bold text-xl text-brand-dark">${(item.price * item.quantity).toFixed(2)}</div>
                            {/* Remove Option */}
                            <button 
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 hover:underline transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                            </button>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                  <div className="text-lg mb-4 flex justify-between items-center">
                    <span>Subtotal ({cart.reduce((a,c)=>a+c.quantity,0)} items):</span>
                  </div>
                  <div className="text-3xl font-bold text-brand-dark mb-6 border-b border-gray-100 pb-4">${total.toFixed(2)}</div>
                  <button className="w-full bg-brand-gold hover:bg-yellow-500 text-white font-bold py-3 rounded-lg shadow-md transition-colors transform active:scale-95 btn-rgb">
                    Proceed to Checkout
                  </button>
              </div>
          </div>
        )}
      </div>
    );
  };

  const renderHome = () => (
    <>
      {/* Hero Section with Shopping Image Background (Black Faded) */}
      <div className="relative bg-black h-[600px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Shopping Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        
        {/* Dark Gradient Overlay to create the "black faded" effect and fade into content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-gray-50"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-10 animate-slide-up">
          <span className="text-brand-accent font-bold tracking-[0.3em] mb-6 text-xs uppercase bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              Intelligent Shopping
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            The Future of Retail <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-purple-400 to-blue-400">is Here</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-md opacity-90">
            Experience the seamless integration of AI, augmented reality, and premium commerce. 
            SmartShopAi adapts to you, providing personalized recommendations and instant visual insights.
          </p>
          <div className="flex gap-6">
              <button onClick={() => setIsChatOpen(true)} className="bg-brand-accent text-white font-bold py-4 px-10 rounded-full hover:bg-brand-accentHover transition-all shadow-lg hover:shadow-brand-accent/50 transform hover:-translate-y-1 flex items-center gap-2 btn-rgb">
                 <span>✨</span> Chat with AI
              </button>
              <button 
                  onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
                  className="bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-all hover:border-white/40 btn-rgb"
              >
                  Browse Collection
              </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-10 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters with Distinct Background */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-6 animate-fade-in">
             {/* Distinct Background: Dark Gradient */}
             <div className="bg-gradient-to-b from-brand-dark to-slate-900 p-5 rounded-xl shadow-xl border border-gray-700 sticky top-24 text-white">
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                 Categories
               </h3>
               <div className="space-y-2">
                 {categories.map(cat => (
                   <div key={cat} className="flex items-center group">
                     <input
                       type="radio"
                       id={cat}
                       name="category"
                       checked={selectedCategory === cat}
                       onChange={() => setSelectedCategory(cat)}
                       className="text-brand-accent focus:ring-brand-accent h-4 w-4 border-gray-500 bg-gray-800 cursor-pointer"
                     />
                     <label htmlFor={cat} className="ml-2 text-sm text-gray-300 cursor-pointer group-hover:text-white transition-colors w-full">{cat}</label>
                   </div>
                 ))}
               </div>

               <hr className="my-4 border-gray-700"/>

               {/* Price Filter */}
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Price Range
               </h3>
               <input 
                 type="range" 
                 min="0" 
                 max="2000" 
                 step="50"
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(Number(e.target.value))}
                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-accent"
               />
               <div className="flex justify-between text-sm text-gray-400 mt-2">
                 <span>$0</span>
                 <span className="font-bold text-brand-dark bg-gray-100 px-2 rounded">$2000+</span>
               </div>
             </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
             <div className="flex justify-between items-end mb-6">
               <h2 className="text-2xl font-bold text-brand-dark">
                 {selectedCategory === 'All' ? 'Featured Recommendations' : selectedCategory} 
                 <span className="text-base font-normal text-gray-500 ml-2">({filteredProducts.length} items)</span>
               </h2>
             </div>
             
             {filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                     <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onClick={handleProductClick} />
                  ))}
               </div>
             ) : (
               <div className="bg-white p-16 rounded-xl text-center shadow-sm flex flex-col items-center justify-center border border-dashed border-gray-300">
                 <div className="text-4xl mb-4 text-gray-300">🔍</div>
                 <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                 <p className="text-gray-500 mb-6">Try adjusting your price range or category.</p>
                 <button 
                    onClick={() => {setSelectedCategory('All'); setMaxPrice(2000)}} 
                    className="text-brand-accent font-bold hover:underline"
                 >
                    Reset Filters
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );

  // Render Switcher
  let mainContent;
  switch (currentView) {
    case ViewState.LOGIN: return <SignIn onSignIn={handleSignIn} onCancel={() => setCurrentView(ViewState.HOME)} />;
    case ViewState.CART: mainContent = renderCart(); break;
    case ViewState.NEW_ARRIVALS: mainContent = renderNewArrivals(); break;
    case ViewState.BEST_SELLERS: mainContent = renderBestSellers(); break;
    case ViewState.DEALS: mainContent = renderDeals(); break;
    case ViewState.GIFT_CARDS: mainContent = renderGiftCards(); break;
    case ViewState.SELL: mainContent = renderSell(); break;
    case ViewState.PRODUCT_DETAIL: mainContent = renderProductDetail(); break;
    case ViewState.HOME:
    default: mainContent = renderHome(); break;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-brand-accent selection:text-white">
      <Header
        cartItems={cart}
        onNavigate={setCurrentView}
        user={user}
        onLoginClick={handleLoginClick}
        currentView={currentView}
        onSearchFocus={() => setIsChatOpen(false)}
        onSearchSubmit={handleSearchSubmit}
      />

      <main className="flex-grow">
        {mainContent}
      </main>

      <footer className="bg-brand-dark text-gray-400 py-12 text-sm mt-auto border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
           <div>
             <h4 className="text-white font-bold mb-4 text-base">Get to Know Us</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Careers</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">About SmartShopAi</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4 text-base">Make Money with Us</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Sell products</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Become an Affiliate</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4 text-base">Payment Products</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Business Card</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Shop with Points</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4 text-base">Let Us Help You</h4>
             <ul className="space-y-2">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Your Account</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Your Orders</a></li>
             </ul>
           </div>
        </div>
        <div className="text-center border-t border-gray-800 pt-8 text-gray-500">
          © 2025, SmartShopAi.com, Inc. or its affiliates
        </div>
      </footer>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        onAddToCart={handleAddToCart}
        externalTriggerMessage={chatTriggerMessage}
      />

      {/* Visual Try-On Modal */}
      {isTryOnOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl animate-slide-up">
                  <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-bold text-lg">AI Virtual Try-On (Beta)</h3>
                      <button onClick={() => setIsTryOnOpen(false)} className="text-gray-500 hover:text-black">✕</button>
                  </div>
                  <div className="p-6 flex flex-col md:flex-row gap-6 h-[500px]">
                      {/* Upload Area */}
                      <div className="w-full md:w-1/3 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 text-center p-4">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-sm text-gray-500 mb-4">Upload a photo of yourself</p>
                          <label className="bg-brand-accent text-white px-4 py-2 rounded-full cursor-pointer hover:bg-brand-accentHover transition-colors">
                              Choose Photo
                              <input type="file" accept="image/*" className="hidden" onChange={handleTryOnUpload} />
                          </label>
                      </div>
                      
                      {/* Canvas Area */}
                      <div className="w-full md:w-2/3 bg-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center">
                          {userPhoto ? (
                              <div className="relative w-full h-full">
                                  <img src={userPhoto} className="w-full h-full object-contain" alt="User" />
                                  {/* Mock Sticker - Product */}
                                  <div 
                                    className="absolute cursor-move w-32 h-32 z-10 border-2 border-brand-accent/50 rounded-lg hover:border-brand-accent transition-all"
                                    style={{ top: `${stickerPos.y}%`, left: `${stickerPos.x}%` }}
                                    onClick={handleDrag}
                                  >
                                      <img src={selectedProduct?.imageUrl} className="w-full h-full object-contain" alt="Sticker" />
                                      <div className="absolute -top-6 left-0 bg-brand-accent text-white text-xs px-2 py-1 rounded">Click to Move</div>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-gray-400">Your photo will appear here</div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* AR Viewer Modal */}
      {isAROpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg">3D View & AR</h3>
                      <button onClick={() => setIsAROpen(false)} className="text-gray-500 hover:text-black">✕</button>
                  </div>
                  <div className="flex-grow bg-gray-100 relative">
                      {/* Improved Model Viewer */}
                      <model-viewer
                          src={selectedProduct?.arModelUrl || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
                          poster={selectedProduct?.imageUrl}
                          alt={`A 3D model of ${selectedProduct?.name}`}
                          shadow-intensity="1"
                          shadow-softness="0.5"
                          exposure="1"
                          camera-controls
                          auto-rotate
                          ar
                          loading="eager"
                          style={{ width: '100%', height: '100%', backgroundColor: '#f9fafb' }}
                      >
                         {/* Custom Loading Slot */}
                         <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-white">
                            <div className="flex flex-col items-center">
                               <img src={selectedProduct?.imageUrl} className="w-32 h-32 object-contain mb-4 opacity-50" />
                               <div className="text-brand-accent font-bold animate-pulse">Loading 3D Model...</div>
                            </div>
                         </div>
                         <button slot="ar-button" className="absolute bottom-6 right-6 bg-brand-accent text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-brand-accentHover transition-transform transform hover:scale-105 flex items-center gap-2 btn-rgb">
                           <span>📱</span> View in your space (AR)
                        </button>
                      </model-viewer>
                  </div>
                  <div className="p-4 text-center text-sm text-gray-500 bg-white border-t border-gray-100">
                      Use your mouse or finger to rotate, zoom, and pan.
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;