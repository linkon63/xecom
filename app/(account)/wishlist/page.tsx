"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Types
type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
};

type WishlistItem = {
  id: string;
  product: Product;
  addedAt: string;
};

// Mock data - replace with actual API calls
const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    product: {
      id: "p1",
      name: "Modern Wooden Chair",
      price: 199.99,
      originalPrice: 249.99,
      image: "/modern-wood-dining-chair.png",
      inStock: true,
    },
    addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "2",
    product: {
      id: "p2",
      name: "Minimalist Coffee Table",
      price: 149.99,
      image: "/outdoor-bar-table.png",
      inStock: true,
    },
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "3",
    product: {
      id: "p3",
      name: "Luxury Velvet Sofa",
      price: 899.99,
      image: "/pink-velvet-sofa.png",
      inStock: false,
    },
    addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "4",
    product: {
      id: "p4",
      name: "Elegant Dining Set",
      price: 1299.99,
      originalPrice: 1499.99,
      image: "/elegant-dining-set.png",
      inStock: true,
    },
    addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setWishlist(mockWishlistItems);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast({
          title: "Error",
          description: "Failed to load your wishlist. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [toast]);

  const removeFromWishlist = async (itemId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setWishlist(wishlist.filter((item) => item.id !== itemId));
      
      toast({
        title: "Removed from wishlist",
        description: "The item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const moveToCart = async (product: Product) => {
    if (!product.inStock) {
      toast({
        title: "Out of stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulate API call to add to cart
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Remove from wishlist after adding to cart
      setWishlist(wishlist.filter((item) => item.product.id !== product.id));
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
          <span>•</span>
          <Link href="/products" className="text-[#B88E2F] hover:underline flex items-center">
            Continue Shopping <MoveRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500 mb-6">
            Save items you love by clicking the heart icon while shopping.
          </p>
          <Link href="/shop">
            <Button className="bg-[#B88E2F] hover:bg-[#9a7628] text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                {!item.product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Heart className="h-5 w-5 text-[#B88E2F] fill-current" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                  {item.product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-semibold">${item.product.price.toFixed(2)}</span>
                  {item.product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Added on {formatDate(item.addedAt)}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <Button
                    className="flex-1 bg-[#B88E2F] hover:bg-[#9a7628] text-white"
                    disabled={!item.product.inStock}
                    onClick={() => moveToCart(item.product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
