import React, { useState } from 'react';

interface SignInProps {
  onSignIn: (name: string) => void;
  onCancel: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    const name = email.split('@')[0] || 'User';
    onSignIn(name.charAt(0).toUpperCase() + name.slice(1));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-purple-900 to-blue-900"></div>
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-block bg-brand-accent p-3 rounded-xl mb-4 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-blue-200 mt-2">Sign in to continue your smart shopping.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-blue-200 cursor-pointer hover:text-white">
              <input type="checkbox" className="mr-2 rounded bg-black/20 border-white/10 text-brand-accent focus:ring-brand-accent" />
              Remember me
            </label>
            <a href="#" className="text-brand-accent hover:text-purple-300 font-medium">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-accent to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-blue-200">
          Don't have an account? <a href="#" className="text-white font-bold hover:underline">Create one</a>
        </div>
        
        <button onClick={onCancel} className="absolute top-4 right-4 text-white/50 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
};