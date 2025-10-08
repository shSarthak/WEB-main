import React, { useState, useEffect } from 'react';
import { Search, Phone, User, ShoppingCart, X } from 'lucide-react';
import GoogleLoginButton from './GoogleLoginButton';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { Link } from "react-router-dom";

// Sign In Modal Component (keep your existing markup/ styles)
const SignInModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold">SIGN IN</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Existing username/password fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username or email *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username or email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Lost your password?
            </a>
          </div>

          <button className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium">
            Login
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">OR SIGN IN WITH A SOCIAL NETWORK</div>

          <div className="space-y-2">
            <GoogleLoginButton
              onLoginSuccess={(userData) => {
                // Save user in sessionStorage
                sessionStorage.setItem('user', JSON.stringify(userData));
                onLoginSuccess(userData);
                // after login, let header react to cart
                window.dispatchEvent(new Event('cart-updated'));
              }}
            />

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <span className="text-lg">f</span>
              <span>FACEBOOK</span>
            </button>
          </div>

          <div className="text-center pt-4 border-t">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              REGISTER
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header Component (your original styles preserved)
const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [user, setUser] = useState(null);

  // fetch cart count from backend
  const fetchCartCount = async (userId) => {
    if (!userId) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/cart/${encodeURIComponent(userId)}`);
      if (res.ok) {
        const items = await res.json();
        setCartCount(items.length);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("❌ Fetch cart count error:", err);
      setCartCount(0);
    }
  };

  // On mount: load user and initial cart count; also listen for cart updates
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCartCount(parsedUser.id);
    }

    const handler = () => {
      const su = sessionStorage.getItem('user');
      if (su) {
        fetchCartCount(JSON.parse(su).id);
      } else {
        setCartCount(0);
      }
    };

      console.log("Header mounted. storedUser:", storedUser);
  window.addEventListener('cart-updated', handler);
  console.log("Header: cart-updated listener attached");

    return () => {
      window.removeEventListener('cart-updated', handler);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowSignInModal(false);
    fetchCartCount(userData.id);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setCartCount(0);
    // notify other parts if needed
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white border-b px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>Privacy Policy</span>
            <span>|</span>
            <span>Terms & Conditions</span>
            <span>|</span>
            <span>Disclaimer</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Need help? Call Us</span>
              <span className="font-semibold">780-355-4767</span>
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <img src={user.picture} alt="profile" className="w-6 h-6 rounded-full" />
                <span className="font-medium">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="ml-2 text-red-600 hover:underline">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            <Link to="/cart" className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              <span>My Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white rounded-full text-xs px-1">{cartCount}</span>
              )}
            </Link>
            <Link to="/wishlist" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors">
              <Heart size={20} />
              Wishlist
            </Link>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignInModal && (
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default Header;
