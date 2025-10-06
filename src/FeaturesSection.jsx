import React from 'react';
import { Search, Phone, User, ShoppingCart, Star, Grid, List } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: "🚚",
      title: "Free Digital Shipping",
      description: "5 Days Free Delivery"
    },
    {
      icon: "🔄",
      title: "Easy & Fast Exchange",
      description: "7 Days Free Exchange Policy"
    },
    {
      icon: "🎧",
      title: "24/7 Customer Support",
      description: "Online Help For 24/7"
    },
    {
      icon: "🔒",
      title: "100% Secure Payments",
      description: "Up Payment Gateway"
    }
  ];

  return (
    <div className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="text-3xl">{feature.icon}</div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;