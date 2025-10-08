import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`http://localhost:5000/wishlist/${user.id}`);
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("❌ Error fetching wishlist:", err);
    }
  };

  const removeFromWishlist = async (itemName) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/wishlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          itemName: itemName
        })
      });

      if (res.ok) {
        setWishlist(prev => prev.filter(item => item.item_name !== itemName));
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      alert("Error removing item from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToCartFromWishlist = async (item) => {
    try {
      const res = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          itemName: item.item_name,
          quantity: 1,
          price: item.price
        })
      });

      if (res.ok) {
        alert("Item added to cart!");
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding item to cart");
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">My Wishlist</h2>
        <p className="text-gray-600">Please log in to view your wishlist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={32} className="text-red-500" />
        <h2 className="text-3xl font-bold">My Wishlist</h2>
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
          {wishlist.length} items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600">Start adding items you love!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="relative mb-4">
                <img
                  src={item.image}
                  alt={item.item_name}
                  className="w-full h-48 object-contain rounded"
                />
              </div>

              <h3 className="font-medium mb-2 line-clamp-2">{item.item_name}</h3>
              
              <div className="mb-4">
                <span className="text-lg font-semibold text-green-600">
                  {item.price}
                </span>
                {item.category && (
                  <span className="text-sm text-gray-500 block mt-1">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCartFromWishlist(item)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.item_name)}
                  disabled={loading}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;