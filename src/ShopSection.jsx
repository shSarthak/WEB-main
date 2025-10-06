import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Search, Phone, User, ShoppingCart, Star, Grid, List } from 'lucide-react';

const ShopSection = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [showCount, setShowCount] = useState(12);
  const [cartQuantities, setCartQuantities] = useState({}); // Track quantities for each product

  const products = [
    { id: 1, name: "AntiFraud.Al Security 1 Device for 1 Year Protection", originalPrice: "₹1,300.00", price: "₹739.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 5, onSale: true },
    { id: 2, name: "IDM Internet Download Manager 1 for 1 PC With Lifetime License", price: "₹1,899.00", image: "/api/placeholder/200/250", category: "Tools", rating: 5 },
    { id: 3, name: "K7 Antivirus Premium 1 Pc for 1 Year Protection", price: "₹299.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 5 },
    { id: 4, name: "K7 Mobile Security - Android 1 User 1 Year", price: "₹169.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 5 },
    { id: 5, name: "K7 Total Security 1 User for 1 Year Protection", price: "₹499.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 5 },
    { id: 6, name: "Kaspersky Premium Antivirus 1 Device for 1 Year Protection", price: "₹609.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 5 },
    { id: 7, name: "Kaspersky Total Security 1 Device for 1 Year Protection", price: "₹690.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 5 },
    { id: 8, name: "McAfee Antivirus 1 Device for 1 Years Protection", price: "₹399.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 4 },
    { id: 9, name: "McAfee Antivirus 1 User For 3 Years Protection", price: "₹650.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 4 },
    { id: 10, name: "McAfee Internet Security 1 Device for 1 Year Protection", price: "₹575.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 4 },
    { id: 11, name: "McAfee Internet Security 1 Device for 3 Year Protection", price: "₹1,049.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 4 },
    { id: 12, name: "McAfee Total Protection 1 Device for 1 Years Protection", originalPrice: "₹849.00", price: "₹649.00", image: "/api/placeholder/200/250", category: "Antivirus", rating: 4, onSale: true }
  ];

  // Handle quantity changes
  const handleQuantityChange = (productId, newQuantity) => {
    setCartQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, newQuantity) // Ensure quantity is at least 1
    }));
  };

  // Add to cart handler with quantity
  const handleAddToCart = async (product) => {
    console.log("ShopSection: handleAddToCart called for", product);
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      alert("Please sign in to add items to cart");
      return;
    }
    const user = JSON.parse(storedUser);

    const quantity = cartQuantities[product.id] || 1;

    try {
      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          itemName: product.name,
          quantity: quantity,
          price: product.price
        })
      });

      console.log("ShopSection: /cart/add response status", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("ShopSection: added to cart response", data);
        window.dispatchEvent(new Event('cart-updated'));
        
        // Reset quantity after adding to cart
        setCartQuantities(prev => ({
          ...prev,
          [product.id]: 1
        }));
      } else {
        console.error("Add to cart failed:", await res.text());
      }
    } catch (err) {
      console.error("❌ Add to cart error:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            The Shop
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Our dedicated digital shop is designed for convenient access to 100% genuine software at unbeatable wholesale prices.
          </p>
        </div>

        {/* Filters and View Options */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>

              <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-slate-600 font-medium">Show</span>
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8 mb-12 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}>
          {products.slice(0, showCount).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              quantity={cartQuantities[product.id] || 1}
              onQuantityChange={(newQuantity) => handleQuantityChange(product.id, newQuantity)}
              onAddToCart={() => handleAddToCart(product)} 
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-3">
          <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
            1
          </button>
          <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-emerald-400 hover:text-emerald-600 transition-all">
            2
          </button>
          <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:border-emerald-400 hover:text-emerald-600 transition-all">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopSection;