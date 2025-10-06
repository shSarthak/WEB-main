import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/cart/${user.id}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the item
      await removeFromCart(itemId);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity
        })
      });
      
      if (res.ok) {
        // Refresh the cart to get updated data
        await fetchCart();
      } else {
        console.error("Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/cart/remove/${itemId}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        // Remove item from local state immediately for better UX
        setCart(prev => prev.filter(item => item.id !== itemId));
      } else {
        console.error("Failed to remove item");
        const errorData = await res.json();
        console.error("Error details:", errorData);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Remove currency symbol and commas, then convert to number
      const price = parseFloat(item.price.replace(/[₹,]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  if (!user) {
    return <p className="p-6">Please log in to view your cart.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Cart</h2>

      {loading && <div className="text-center py-4">Updating cart...</div>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.item_name}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-600 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      className="ml-4 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-semibold block">
                    {item.price}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-gray-500">
                      {item.quantity} × {item.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Section */}
          <div className="bg-white p-4 rounded shadow border-t-4 border-green-500">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ₹{calculateTotal().toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;