import React from 'react';
import { Search, Phone, User, ShoppingCart, Star, Grid, List } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="font-semibold mb-4">ABOUT COMPANY</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Affiliates</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Office 2021 Pro 🏆</a></li>
              <li><a href="#" className="hover:text-white">Windows 10 Pro 🏆</a></li>
              <li><a href="#" className="hover:text-white">Office 365</a></li>
              <li><a href="#" className="hover:text-white">Office 365 🏆</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">STORE POLICIES</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white">Shipping</a></li>
              <li><a href="#" className="hover:text-white">DMCA Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">PRODUCT POLICIES</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white">Return Policy</a></li>
              <li><a href="#" className="hover:text-white">Support Policy</a></li>
              <li><a href="#" className="hover:text-white">Update Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">SUBSCRIBE</h3>
            <div className="flex space-x-3 text-xl">
              <a href="#" className="hover:text-blue-400">📘</a>
              <a href="#" className="hover:text-pink-400">📷</a>
              <a href="#" className="hover:text-blue-400">💼</a>
              <a href="#" className="hover:text-red-400">📺</a>
              <a href="#" className="hover:text-gray-400">✉️</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-xl font-bold text-orange-500">
                🌲 webforest
              </div>
              <div className="text-sm text-gray-300">
                <span>Phone: </span>+917906554767
                <span className="mx-2">Email: </span>hello@webforest.in
                <span className="mx-2">Office Hours: </span>24/7 Service Available in India
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Copyright © 2024 Webforest Digital
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-4">
            <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
            <img src="/api/placeholder/40/25" alt="Mastercard" className="h-6" />
            <img src="/api/placeholder/40/25" alt="PayPal" className="h-6" />
            <img src="/api/placeholder/40/25" alt="Apple Pay" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;