import React, { useState } from 'react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

interface CartProps {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onBrowse: () => void;
  onCheckoutComplete: () => void;
}

export const Cart: React.FC<CartProps> = ({
  cart,
  onRemove,
  onClear,
  onBrowse,
  onCheckoutComplete
}) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onClear();
      onCheckoutComplete();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto p-6 max-w-2xl py-24 text-center"
      >
        <div className="bg-white p-12 rounded-3xl shadow-xl shadow-brand-dark/5 border border-gray-100 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          >
             <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
          </motion.div>
          <h2 className="text-4xl font-black text-brand-dark mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-8 text-lg">Thank you for your order. We've sent a confirmation email with your order details.</p>
          <button 
            onClick={onBrowse}
            className="bg-brand-accent text-white font-bold py-3 px-8 rounded-full hover:bg-brand-accentHover transition-colors flex items-center gap-2"
          >
             Continue Shopping <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto p-6 max-w-5xl"
    >
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 flex items-center gap-3">
        {isCheckout ? 'Checkout' : 'Shopping Cart'} 
        {!isCheckout && <span className="bg-brand-accent/10 text-brand-accent text-sm py-1 px-3 rounded-full">{cart.reduce((a,c)=>a+c.quantity,0)} items</span>}
      </h2>
      
      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-16 rounded-3xl shadow-sm text-center border border-dashed border-gray-200"
        >
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <p className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</p>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Discover our premium collection.</p>
          <button 
            onClick={onBrowse} 
            className="bg-brand-accent text-white px-8 py-4 rounded-full hover:bg-brand-accentHover transition-all shadow-lg hover:shadow-brand-accent/30 font-bold btn-rgb inline-flex items-center gap-2"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow space-y-6">
            {!isCheckout ? (
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0 }}
                      className="flex gap-6 border-b border-gray-50 p-4 last:border-0 items-center group bg-white hover:bg-gray-50/50 rounded-xl transition-colors"
                    >
                      <div className="bg-gray-100 p-3 rounded-xl w-24 h-24 flex items-center justify-center flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"/>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                        <div className="text-sm text-emerald-500 font-medium mt-1 flex items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" /> In Stock
                        </div>
                        <div className="flex items-center mt-3 gap-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</span>
                          <span className="font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-md">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 min-w-[100px]">
                        <div className="font-black text-xl text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                 <h3 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Shipping Details</h3>
                 <form className="space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-sm font-medium text-gray-600">First Name</label><input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors" defaultValue="Jane" /></div>
                       <div><label className="text-sm font-medium text-gray-600">Last Name</label><input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors" defaultValue="Doe" /></div>
                    </div>
                    <div><label className="text-sm font-medium text-gray-600">Address</label><input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors" defaultValue="123 Tech Lane" /></div>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="col-span-2"><label className="text-sm font-medium text-gray-600">City</label><input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors" defaultValue="San Francisco" /></div>
                       <div><label className="text-sm font-medium text-gray-600">Zip</label><input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 mt-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-colors" defaultValue="94105" /></div>
                    </div>
                 </form>
                 
                 <h3 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-500" /> Payment
                 </h3>
                 <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 flex justify-between items-center opacity-70">
                    <div className="flex gap-3 items-center">
                       <div className="w-12 h-8 bg-blue-600 rounded-md text-white font-bold italic text-xs flex items-center justify-center">VISA</div>
                       <span className="font-medium text-gray-700">•••• •••• •••• 4242</span>
                    </div>
                    <span className="text-sm text-gray-500">12/26</span>
                 </div>
                 <p className="text-xs text-gray-500 text-center italic">* This is a simulated checkout. No real charges will be made.</p>
              </motion.div>
            )}
          </div>
          
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-brand-dark/5 border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.reduce((a,c)=>a+c.quantity,0)} items)</span>
                  <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-gray-900">${(total * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-brand-dark">${(total * 1.08).toFixed(2)}</span>
              </div>
              
              {!isCheckout ? (
                <button 
                  onClick={() => setIsCheckout(true)}
                  className="w-full bg-brand-accent hover:bg-brand-accentHover text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-accent/40 transition-all transform hover:-translate-y-0.5 btn-rgb flex justify-center items-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handlePay}
                  disabled={isProcessing}
                  className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 text-white ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-dark hover:bg-black btn-rgb'}`}
                >
                  {isProcessing ? 'Processing...' : `Pay $${(total * 1.08).toFixed(2)}`}
                </button>
              )}
              
              {isCheckout && (
                <button 
                  onClick={() => setIsCheckout(false)}
                  className="w-full text-center mt-4 text-sm font-medium text-gray-500 hover:text-brand-accent"
                >
                   ← Back to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
