import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { SignIn } from './components/SignIn';
import { Home } from './components/Home';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem, ViewState, User } from './types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import { ProductCard } from './components/ProductCard';

declare module 'react' {
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
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTriggerMessage, setChatTriggerMessage] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User>({ name: 'Guest', isLoggedIn: false });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [stickerPos, setStickerPos] = useState({ x: 50, y: 50 });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = useMemo(() => ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))], []);
  
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [selectedCategory, maxPrice, searchTerm]);

  const handleNavigate = useCallback((view: ViewState) => {
    setCurrentView(view);
    setSearchTerm('');
  }, []);

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
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setCurrentView(ViewState.PRODUCT_DETAIL);
    window.scrollTo(0, 0);
  }, []);

  const handleLoginClick = () => {
    if (user.isLoggedIn) {
      setUser({ name: 'Guest', isLoggedIn: false });
      toast.info("Logged out successfully");
    } else {
      setCurrentView(ViewState.LOGIN);
    }
  };

  const handleSignIn = (name: string) => {
    setUser({ name, isLoggedIn: true });
    setCurrentView(ViewState.HOME);
    toast.success(`Welcome back, ${name}!`);
  };

  const handleSearchSubmit = (term: string) => {
      if(!term) {
          setSearchTerm('');
          return;
      }
      const matches = MOCK_PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(term.toLowerCase()) || 
          p.category.toLowerCase().includes(term.toLowerCase()) ||
          p.description.toLowerCase().includes(term.toLowerCase())
      );
      if (matches.length > 0) {
          setCurrentView(ViewState.HOME);
          setSelectedCategory('All');
          setSearchTerm(term);
      } else {
          setIsChatOpen(true);
          const msg = `I noticed you're looking for "${term}". We don't have it in stock right now, but I can ask management to arrange it within 3 days! Shall I show you similar items?`;
          setChatTriggerMessage(msg);
          setTimeout(() => setChatTriggerMessage(undefined), 1000);
      }
  };

  const handleTryOnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setUserPhoto(reader.result as string);
          reader.readAsDataURL(file);
      }
  }

  const handleDrag = (e: React.MouseEvent) => {
      setStickerPos({
          x: Math.min(80, Math.max(10, stickerPos.x + (Math.random() - 0.5) * 5)),
          y: Math.min(80, Math.max(10, stickerPos.y + (Math.random() - 0.5) * 5))
      })
  }

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return MOCK_PRODUCTS.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4);
  }, [selectedProduct]);

  // Legacy page renderers for secondary links
  const renderNewArrivals = () => (
    <div className="container mx-auto p-6 animate-fade-in pb-20">
        <div className="bg-brand-accent text-white p-12 rounded-3xl mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-10 -top-10 bg-white opacity-10 w-64 h-64 rounded-full blur-3xl"></div>
            <h1 className="text-5xl font-bold relative z-10">Fresh Drops</h1>
            <p className="relative z-10 mt-4 text-xl opacity-90 max-w-2xl">Be the first to own the latest tech and trends.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.filter(p => p.isNew || Math.random() > 0.7).map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onClick={handleProductClick} />
            ))}
        </div>
    </div>
  );

  const renderBestSellers = () => (
      <div className="container mx-auto p-6 animate-fade-in pb-20">
          <div className="bg-gradient-to-r from-yellow-500 to-brand-gold p-12 rounded-3xl mb-8 text-white shadow-2xl">
              <h1 className="text-5xl font-bold mb-4">Community Favorites</h1>
              <p className="text-xl opacity-90">Top rated products loved by thousands.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_PRODUCTS.filter(p => p.rating >= 4.7).map(p => (
                  <div key={p.id} className="relative">
                      <div className="absolute -top-3 -left-3 z-10 bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <span className="text-brand-gold">★</span> #1 Best Seller
                      </div>
                      <ProductCard product={p} onAddToCart={handleAddToCart} onClick={handleProductClick} />
                  </div>
              ))}
          </div>
      </div>
  );

  const renderDeals = () => (
    <div className="container mx-auto p-6 animate-fade-in pb-20">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-12 rounded-3xl mb-8 text-white shadow-2xl flex justify-between items-center overflow-hidden relative">
            <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-4">Flash Deals</h1>
                <p className="text-xl opacity-90">Limited time offers. Don't miss out!</p>
            </div>
            <div className="text-8xl animate-pulse opacity-50 absolute right-10 -bottom-4 z-0">⚡</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map(p => {
                const discount = p.discount || (Math.random() > 0.5 ? 15 : 0);
                if (discount === 0) return null;
                return (
                    <div key={p.id} className="relative">
                        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">-{discount}%</div>
                        <ProductCard product={{...p, price: p.price * (1 - discount/100)}} onAddToCart={handleAddToCart} onClick={handleProductClick} />
                    </div>
                );
            })}
        </div>
    </div>
  );

  let mainContent;
  switch (currentView) {
    case ViewState.LOGIN: mainContent = <SignIn key="login" onSignIn={handleSignIn} onCancel={() => setCurrentView(ViewState.HOME)} />; break;
    case ViewState.CART: 
      mainContent = <Cart key="cart" cart={cart} onRemove={handleRemoveFromCart} onClear={handleClearCart} onBrowse={() => setCurrentView(ViewState.HOME)} onCheckoutComplete={() => {}} />; 
      break;
    case ViewState.PRODUCT_DETAIL: 
      if (selectedProduct) {
        mainContent = <ProductDetail key="product" product={selectedProduct} onBack={() => setCurrentView(ViewState.HOME)} onAddToCart={handleAddToCart} onOpenAR={() => setIsAROpen(true)} onOpenTryOn={() => {setUserPhoto(null); setIsTryOnOpen(true);}} relatedProducts={relatedProducts} onProductClick={handleProductClick} />; 
      }
      break;
    case ViewState.NEW_ARRIVALS: mainContent = <div key="new-arrivals">{renderNewArrivals()}</div>; break;
    case ViewState.BEST_SELLERS: mainContent = <div key="best-sellers">{renderBestSellers()}</div>; break;
    case ViewState.DEALS: mainContent = <div key="deals">{renderDeals()}</div>; break;
    case ViewState.HOME:
    default: 
      mainContent = <Home key="home" categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} maxPrice={maxPrice} setMaxPrice={setMaxPrice} filteredProducts={filteredProducts} onAddToCart={handleAddToCart} onProductClick={handleProductClick} onOpenChat={() => setIsChatOpen(true)} />; 
      break;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-brand-accent selection:text-white">
      <Header
        cartItems={cart}
        onNavigate={handleNavigate}
        user={user}
        onLoginClick={handleLoginClick}
        currentView={currentView}
        onSearchFocus={() => setIsChatOpen(false)}
        onSearchSubmit={handleSearchSubmit}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat === 'All Departments' ? 'All' : cat);
          setSearchTerm('');
        }}
        selectedCategory={selectedCategory}
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
           {mainContent}
        </AnimatePresence>
      </main>

      <footer className="bg-brand-dark text-gray-400 py-16 text-sm mt-auto border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
           <div>
             <h4 className="text-white font-bold mb-6 text-lg">Get to Know Us</h4>
             <ul className="space-y-4">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Careers</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">About SmartShopAi</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-6 text-lg">Make Money with Us</h4>
             <ul className="space-y-4">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Sell products</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Become an Affiliate</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-6 text-lg">Payment Products</h4>
             <ul className="space-y-4">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Business Card</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Shop with Points</a></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-6 text-lg">Let Us Help You</h4>
             <ul className="space-y-4">
               <li><a href="#" className="hover:text-brand-accent transition-colors">Your Account</a></li>
               <li><a href="#" className="hover:text-brand-accent transition-colors">Your Orders</a></li>
             </ul>
           </div>
        </div>
        <div className="text-center border-t border-gray-800 pt-8 text-gray-500 flex flex-col items-center">
          <span className="mb-2">© 2026, SmartShopAi.com, Inc. or its affiliates</span>
          <span className="text-xs text-gray-600">Built with ❤️ for industry grade retail</span>
        </div>
      </footer>

      <ChatInterface
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        onAddToCart={handleAddToCart}
        externalTriggerMessage={chatTriggerMessage}
      />

      {isTryOnOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-slide-up">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                        <span className="text-purple-500">👕</span> AI Virtual Try-On <span className="bg-brand-accent text-white text-xs px-2 py-0.5 rounded-full ml-2">Beta</span>
                      </h3>
                      <button onClick={() => setIsTryOnOpen(false)} className="text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                        ✕
                      </button>
                  </div>
                  <div className="p-8 flex flex-col md:flex-row gap-8 h-[500px]">
                      <div className="w-full md:w-1/3 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors text-center p-6">
                          <div className="text-5xl mb-4">📸</div>
                          <p className="text-gray-600 mb-6 font-medium">Upload a photo to see how it looks on you</p>
                          <label className="bg-brand-dark text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-black transition-colors font-bold w-full shadow-lg">
                              Choose Photo
                              <input type="file" accept="image/*" className="hidden" onChange={handleTryOnUpload} />
                          </label>
                      </div>
                      
                      <div className="w-full md:w-2/3 bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
                          {userPhoto ? (
                              <div className="relative w-full h-full">
                                  <img src={userPhoto} className="w-full h-full object-contain" alt="User" />
                                  <div 
                                    className="absolute cursor-move w-40 h-40 z-10 border-2 border-brand-accent/50 rounded-xl hover:border-brand-accent transition-colors bg-white/10 backdrop-blur-sm p-2 shadow-xl group"
                                    style={{ top: `${stickerPos.y}%`, left: `${stickerPos.x}%` }}
                                    onClick={handleDrag}
                                  >
                                      <img src={selectedProduct?.imageUrl} className="w-full h-full object-contain drop-shadow-md" alt="Sticker" />
                                      <div className="absolute -top-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="bg-brand-dark text-white text-xs px-3 py-1 rounded-full shadow-lg">Click to Move</span>
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="text-gray-400 font-medium flex flex-col items-center">
                                <div className="text-6xl mb-4 opacity-20">👤</div>
                                Your photo will appear here
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {isAROpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
              <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                         <span className="text-blue-500">🧊</span> 3D Interactive View
                      </h3>
                      <button onClick={() => setIsAROpen(false)} className="text-gray-400 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 p-2 rounded-full transition-colors">
                        ✕
                      </button>
                  </div>
                  <div className="flex-grow bg-gradient-to-b from-gray-100 to-gray-200 relative">
                      <model-viewer
                          src={selectedProduct?.arModelUrl || 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'}
                          poster={selectedProduct?.imageUrl}
                          alt={`A 3D model of ${selectedProduct?.name}`}
                          shadow-intensity="1.5"
                          shadow-softness="1"
                          exposure="1.2"
                          camera-controls
                          auto-rotate
                          ar
                          loading="eager"
                          style={{ width: '100%', height: '100%' }}
                      >
                         <div slot="poster" className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                            <div className="flex flex-col items-center">
                               <img src={selectedProduct?.imageUrl} className="w-32 h-32 object-contain mb-6 opacity-30 drop-shadow-lg" />
                               <div className="text-brand-accent font-bold animate-pulse bg-white px-6 py-2 rounded-full shadow-sm border border-brand-accent/20">Loading 3D Model...</div>
                            </div>
                         </div>
                         <button slot="ar-button" className="absolute bottom-8 right-8 bg-brand-accent text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_20px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(124,58,237,0.6)] hover:bg-brand-accentHover transition-all transform hover:scale-105 flex items-center gap-3 btn-rgb">
                           <span className="text-xl">📱</span> View in your space
                        </button>
                      </model-viewer>
                  </div>
                  <div className="p-5 text-center text-sm font-medium text-gray-500 bg-white border-t border-gray-100">
                      Use your mouse or finger to rotate, zoom, and pan. Drag to explore details.
                  </div>
              </div>
          </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default App;