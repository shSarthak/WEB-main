import "./App.css";
import React from "react";
import Header from "./Header";
import ShopSection from "./ShopSection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./CartPage";
import { CartProvider } from "./CartContext"; // Updated import
import WishlistPage from "./WishListPage";
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <ShopSection />
                  <FeaturesSection />
                </>
              }
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;