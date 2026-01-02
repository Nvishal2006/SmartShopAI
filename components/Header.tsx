import React, { useState, useEffect, useRef } from 'react';
import { CartItem, ViewState, User, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface HeaderProps {
  cartItems: CartItem[];
  onNavigate: (view: ViewState) => void;
  user: User;
  onLoginClick: () => void;
  currentView: ViewState;
  onSearchFocus: () => void;
  onSearchSubmit: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  cartItems, 
  onNavigate, 
  user, 
  onLoginClick, 
  currentView,
  onSearchFocus,
  onSearchSubmit
}) => {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState({ code: 'EN', flag: '🇺🇸' });

  const searchRef = useRef<HTMLDivElement>(null);
  const deptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const matches = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close search suggestions
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      // Close Depts dropdown
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => onNavigate(ViewState.HOME);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        setShowSuggestions(false);
        onSearchSubmit(searchTerm);
    }
  }

  const handleDeptSelect = (category: string) => {
      onNavigate(ViewState.HOME);
      setIsDeptOpen(false);
  }

  return (
    <header className="bg-brand-dark text-white sticky top-0 z-40 shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {currentView !== ViewState.HOME && (
            <button 
              onClick={() => onNavigate(ViewState.HOME)}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium group"
            >
              <div className="bg-gray-800 p-1.5 rounded-full group-hover:bg-brand-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
              </div>
            </button>
          )}
          
          <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleLogoClick}
          >
              <div className="bg-brand-accent p-1.5 rounded-lg shadow-lg shadow-brand-accent/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tighter">SmartShop<span className="text-brand-accent">Ai</span></span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-grow mx-8 max-w-2xl relative" ref={searchRef}>
          <div className="flex w-full rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-brand-accent transition-all bg-white">
            
            {/* Depts Dropdown */}
            <div className="relative" ref={deptRef}>
               <button 
                 onClick={() => setIsDeptOpen(!isDeptOpen)}
                 className="bg-gray-100 text-gray-700 px-4 py-2 text-sm border-r border-gray-200 hover:bg-gray-200 h-full font-medium flex items-center gap-1 transition-colors"
               >
                 Depts
                 <svg className={`w-3 h-3 transition-transform ${isDeptOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
               </button>
               
               {isDeptOpen && (
                 <div className="absolute top-full left-0 w-56 bg-white text-gray-800 shadow-xl rounded-b-lg border-t border-gray-100 animate-fade-in z-50">
                   <div className="py-2">
                     {['All Departments', 'Electronics', 'Computers', 'Smart Home', 'Furniture', 'Cameras'].map(d => (
                        <button 
                          key={d} 
                          onClick={() => handleDeptSelect(d)} 
                          className="block w-full text-left px-4 py-2 hover:bg-brand-accent hover:text-white transition-colors cursor-pointer text-sm"
                        >
                          {d}
                        </button>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={onSearchFocus}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search for products..."
                className="flex-grow px-4 py-2 text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
            />
            <button 
                onClick={() => onSearchSubmit(searchTerm)}
                className="bg-brand-accent hover:bg-brand-accentHover px-6 flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-white text-gray-900 rounded-b-lg shadow-xl border border-gray-100 z-50 animate-slide-up mt-1">
              {suggestions.length > 0 ? (
                <ul>
                  {suggestions.map(product => (
                    <li 
                      key={product.id} 
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b last:border-0 border-gray-100 transition-colors"
                      onClick={() => {
                        setSearchTerm(product.name);
                        setShowSuggestions(false);
                        onSearchSubmit(product.name);
                      }}
                    >
                      <img src={product.imageUrl} alt="" className="w-10 h-10 object-contain rounded bg-gray-100 p-0.5"/>
                      <div>
                        <div className="text-sm font-bold highlight-text">{product.name}</div>
                        <div className="text-xs text-gray-500">in {product.category}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-gray-500 text-center">No matches found</div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
           <div className="relative hidden lg:block">
              <div 
                className="flex items-center gap-1 cursor-pointer hover:text-gray-300 p-1 rounded"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              >
                 <span className="text-lg">{currentLang.flag}</span>
                 <span className="text-sm font-bold">{currentLang.code}</span>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              {langDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-brand-dark text-white rounded-lg shadow-xl border border-white/10 z-50 animate-fade-in">
                   <div className="p-1">
                     {[
                         {code: 'EN', flag: '🇺🇸', name: 'English'}, 
                         {code: 'ES', flag: '🇪🇸', name: 'Español'}, 
                         {code: 'FR', flag: '🇫🇷', name: 'Français'}
                     ].map(l => (
                         <div key={l.code} 
                              className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded cursor-pointer"
                              onClick={() => { setCurrentLang(l); setLangDropdownOpen(false); }}
                         >
                             <span>{l.flag}</span>
                             <span className="text-sm">{l.name}</span>
                         </div>
                     ))}
                   </div>
                </div>
              )}
           </div>

           <div className="cursor-pointer group" onClick={onLoginClick}>
             <div className="text-[10px] text-gray-400 group-hover:text-brand-accent transition-colors">Hello, {user.isLoggedIn ? user.name : 'Sign In'}</div>
             <div className="font-bold text-sm -mt-1 group-hover:text-brand-accent transition-colors">Account & Lists</div>
           </div>

           <div className="relative cursor-pointer group" onClick={() => onNavigate(ViewState.CART)}>
             <div className="p-2 rounded-full bg-gray-800 group-hover:bg-brand-accent transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>
             </div>
             <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm border-2 border-brand-dark animate-bounce-slight">
               {totalItems}
             </span>
           </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="bg-brand-light border-t border-gray-700 py-0 text-sm flex gap-1 overflow-x-auto text-gray-300 shadow-inner px-2">
        {[
            { label: 'Home', view: ViewState.HOME },
            { label: 'New Arrivals', view: ViewState.NEW_ARRIVALS },
            { label: 'Best Sellers', view: ViewState.BEST_SELLERS },
            { label: 'Deals', view: ViewState.DEALS },
            { label: 'Gift Cards', view: ViewState.GIFT_CARDS },
            { label: 'Sell on SmartShop', view: ViewState.SELL }
        ].map(item => (
            <button 
                key={item.label}
                onClick={() => onNavigate(item.view)}
                className={`px-4 py-2 hover:text-white hover:bg-gray-700 transition-all whitespace-nowrap font-medium border-b-2 ${currentView === item.view ? 'border-brand-accent text-white bg-gray-700' : 'border-transparent'}`}
            >
                {item.label}
            </button>
        ))}
      </div>
    </header>
  );
};