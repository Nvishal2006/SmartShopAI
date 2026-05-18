import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAssistant, getProductRecommendations } from '../services/geminiService';
import { ChatMessage, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface ChatInterfaceProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onAddToCart: (p: Product) => void;
  externalTriggerMessage?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, setIsOpen, onAddToCart, externalTriggerMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hi! I'm ShopBot. I can help you find products, compare items, or analyze photos. Upload an image or ask away!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalTriggerMessage && isOpen) {
      setMessages(prev => [...prev, { role: 'model', content: externalTriggerMessage }]);
    }
  }, [externalTriggerMessage, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, attachedImage]);

  // Voice Input Handler
  const handleVoiceInput = () => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // If already listening, do nothing (let it finish or user stop)
    if (isListening) {
        return; 
    }

    try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
              alert("Microphone access denied. Please allow microphone access in your browser settings.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
    } catch (e) {
        console.error("Failed to start recognition", e);
        setIsListening(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove data URL prefix for API, keep it for display
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && !attachedImage) || isLoading) return;

    const userText = inputValue;
    const userImage = attachedImage;
    
    setInputValue('');
    setAttachedImage(null);
    setIsLoading(true);

    // 1. Add User Message
    const newHistory: ChatMessage[] = [...messages, { 
      role: 'user', 
      content: userText,
      imageData: userImage || undefined
    }];
    setMessages(newHistory);

    // 2. Check Local for text matches
    const lc = userText.toLowerCase();
    const immediateMatches = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lc) || 
      p.category.toLowerCase().includes(lc) ||
      p.tags.some(t => lc.includes(t))
    ).slice(0, 3);

    let instantRecs: Product[] = immediateMatches;

    try {
      let aiText = "";
      let aiRecs: Product[] = [];

      // 3. Call AI API
      const historyForApi = newHistory.map(m => {
        const parts: any[] = [];
        if (m.content) parts.push({ text: m.content });
        if (m.imageData) {
           const base64Data = m.imageData.split(',')[1];
           parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Data } });
        }
        return {
          role: m.role,
          parts: parts
        };
      });

      const lastMsg = historyForApi.pop(); 
      
      if (userImage) {
        const prevHistory = historyForApi;
        // Pass full history including image context by just asking to process last input
        // Note: In a real app, we'd construct the chat object carefully.
        // Here we use a simplified flow where we send the context as part of the new turn if needed
        // or rely on the service wrapper.
        aiText = await sendMessageToAssistant(
             "Please answer the user's last input based on the attached image if present.", 
             [...prevHistory, lastMsg!] // Send full history including current image
        );
      } else {
          const prevHistory = historyForApi.slice(0, -1); // Not used in current logic effectively
          // Correcting flow: we send the text, and pass the *previous* history.
          // The service creates a chat with `history` and sends `message`.
          aiText = await sendMessageToAssistant(userText, historyForApi);
      }

      // Get recs
      if ((lc.includes('recommend') || lc.includes('suggest') || instantRecs.length === 0) && !userImage) {
         aiRecs = await getProductRecommendations(userText);
      }

      // Deduplicate
      const combinedRecs = [...instantRecs, ...aiRecs];
      const uniqueRecs = Array.from(new Set(combinedRecs.map(p => p.id)))
        .map(id => combinedRecs.find(p => p.id === id)!);

      setMessages(prev => [
        ...prev,
        { role: 'model', content: aiText, recommendedProducts: uniqueRecs.length > 0 ? uniqueRecs : undefined }
      ]);

    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm having trouble connecting right now. Try checking your network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-accent hover:bg-brand-accentHover text-white p-4 rounded-full shadow-2xl transition-all z-50 flex items-center gap-2 group animate-bounce-slight"
      >
        <span className="text-2xl">🤖</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium pl-0 group-hover:pl-2">
            Ask ShopBot
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden animate-slide-up ring-1 ring-black/5">
      <div className="bg-gradient-to-r from-brand-dark to-brand-light p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full absolute -right-1 -bottom-1 border-2 border-brand-dark animate-pulse"></div>
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">ShopBot AI</h3>
            <p className="text-[10px] text-blue-200">Multimodal Assistant (Voice & Vision)</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors bg-white/10 rounded-full p-1 w-8 h-8 flex items-center justify-center">
          ✕
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
            {msg.imageData && (
              <img src={msg.imageData} alt="Uploaded" className="max-w-[150px] rounded-lg border border-gray-200 mb-2" />
            )}
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-accent text-white rounded-br-none'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
            {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
              <div className="mt-3 w-full pl-2">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Results found:</p>
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x px-1">
                  {msg.recommendedProducts.map(p => (
                    <div key={p.id} className="min-w-[150px] w-[150px] snap-center transform hover:scale-105 transition-transform duration-200">
                        <div className="bg-white border border-gray-100 rounded-xl p-2 text-center shadow-md h-full flex flex-col">
                           <div className="h-24 w-full bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                               <img src={p.imageUrl} className="h-full object-contain mix-blend-multiply" alt={p.name}/>
                           </div>
                           <div className="font-medium text-xs truncate mb-1 text-gray-800" title={p.name}>{p.name}</div>
                           <div className="text-brand-accent font-bold text-sm mt-auto">${p.price}</div>
                           <button
                             onClick={() => onAddToCart(p)}
                             className="mt-2 w-full bg-brand-dark text-white text-[10px] py-1.5 rounded-lg hover:bg-brand-accent transition-colors font-medium"
                           >
                             Add to Cart
                           </button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-1 ml-4 mt-2">
            <div className="w-2 h-2 bg-brand-accent/50 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand-accent/50 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-brand-accent/50 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview */}
      {attachedImage && (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <img src={attachedImage} className="w-8 h-8 object-cover rounded" />
             <span className="text-xs text-gray-500">Image attached</span>
          </div>
          <button onClick={() => setAttachedImage(null)} className="text-gray-500 hover:text-red-500">✕</button>
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2 relative items-center">
          {/* Image Upload Button */}
          <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-brand-accent transition-colors p-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Type or use mic..."}
            className={`flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all ${isListening ? 'border-green-400 ring-green-200' : ''}`}
          />
          
          {/* Mic Button */}
          <button 
             onClick={handleVoiceInput}
             className={`text-gray-400 hover:text-brand-accent transition-colors p-2 ${isListening ? 'text-green-500 animate-pulse' : ''}`}
             title="Click to speak"
          >
             {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
             )}
          </button>

          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-brand-accent text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-accentHover disabled:opacity-50 disabled:hover:bg-brand-accent transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};