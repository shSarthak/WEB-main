import React, { useState } from "react";
import WishListButton from "./WishListButton";
const ProductCard = ({ product, quantity, onQuantityChange, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const user =JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;
const handleAddToCartClick = async () => {
  if (!showQuantitySelector) {
    // First click - show quantity selector
    setShowQuantitySelector(true);
  } else {
    // Second click - add to cart with selected quantity
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      alert("Please log in first!");
      return;
    }

    // Call parent handler instead of making API call here
    if (onAddToCart) {
      onAddToCart();
    }

    setIsAdded(true);
    setShowQuantitySelector(false);
    setTimeout(() => setIsAdded(false), 2000);
  }
};

  // FIXED: Only call onQuantityChange, don't update local state
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      onQuantityChange(newQuantity); // This updates the parent state
    }
  };

  // FIXED: Only call onQuantityChange
  const handleDirectQuantityInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      onQuantityChange(value); // This updates the parent state
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain"
        />
        {product.onSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium mb-2 line-clamp-2 h-10">{product.name}</h3>

      <div className="mb-3">
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through mr-2">
            {product.originalPrice}
          </span>
        )}
        <span className="text-lg font-semibold text-green-600">
          {product.price}
        </span>
      </div>

      {showQuantitySelector && !isAdded ? (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleDirectQuantityInput}
              min="1"
              max="10"
              className="w-12 text-center border rounded py-1"
            />
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-600">Qty: {quantity}</span>
        </div>
      ) : null}

      <div className="top-2 right-2 z-10">
        <WishListButton product={product} userId={userId} />
      </div>
      <button
        onClick={handleAddToCartClick}
        className={`w-full py-2 px-4 rounded transition-colors ${
          isAdded
            ? "bg-green-500 text-white"
            : showQuantitySelector
            ? "bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isAdded ? (
          "✓ Added to cart"
        ) : showQuantitySelector ? (
          `Add ${quantity} to Cart`
        ) : (
          "🛒 Add to cart"
        )}
      </button>

      {showQuantitySelector && !isAdded && (
        <button
          onClick={() => setShowQuantitySelector(false)}
          className="w-full mt-2 py-1 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ProductCard;