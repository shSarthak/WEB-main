import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react';
const WishListButton = ({ product, userId }) => {
    const [isInWishlist, setIsInWishList] = useState(false);
    const [loading, setLoading] = useState(false);
    //check if the product is in wishlist

    useEffect(() => {
        if (userId && product.name) {
            checkWishlistStatus();
        }
    }, [userId, product.name])

    const checkWishlistStatus = async () => {
        try {
            const res = await fetch(`http://localhost:5000/wishlist/${userId}/${encodeURIComponent(product.name)}`)
            if (res.ok) {
                const data = await res.json();
                setIsInWishList(data.isInWishList);
            }
        } catch {
            //igonore this error
        }
    }

    const toggleWishlist = async () => {
        if (!userId) {
            alert("Please log in to view the wishlist");
            return;
        }
        setLoading(true);
        try {
            if (isInWishlist) {
                const res = await fetch("http://localhost:5000/wishlist/remove", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userId,
                        itemName: product.name
                    })
                });

                if (res.ok) {
                    setIsInWishList(false);
                }
            } else {
                //add to wishlist
                const res = await fetch("http://localhost:5000/wishlist/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: userId,
                        itemName: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category
                    })
                });
                if(res.ok) {
                    setIsInWishList(true);
                } else if(res.status === 409) {
                    setIsInWishList(true);
                }
            }
        } catch {
            //ignore this error
        } finally {
            setLoading(false);
        }
    }
      return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`p-2 rounded-full transition-all ${
        isInWishlist 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        size={20} 
        className={isInWishlist ? "fill-current" : ""} 
      />
    </button>
  );
}

export default WishListButton