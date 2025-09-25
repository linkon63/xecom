"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, StarOff, Star as StarIconSolid, Edit, Trash2, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Review, NewReview } from "@/db/schema/reviews";
import { useToast } from "@/components/ui/use-toast";

// Types for orders and products
type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  orderDate: Date;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderDate: Date;
  items: OrderItem[];
  status: 'completed' | 'processing' | 'cancelled' | 'shipped';
};

// Extended Review type to include product info for display
type ReviewWithProduct = Review & {
  productName: string;
  productImage: string;
  orderItemId?: string; // To track which order item this review is for
};

// Mock data - replace with actual API calls
const mockReviews: ReviewWithProduct[] = [
  {
    id: "1",
    userId: "user-123",
    productId: "product-1",
    productName: "Modern Wooden Chair",
    productImage: "/placeholder-chair.jpg",
    rating: 4,
    title: "Great quality and comfortable",
    comment: "The chair is very comfortable and looks exactly like in the pictures. The quality is excellent for the price.",
    isVerified: true,
    isApproved: true,
    helpfulCount: 12,
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-15"),
  },
  {
    id: "2",
    userId: "user-123",
    productId: "product-2",
    productName: "Minimalist Desk",
    productImage: "/placeholder-desk.jpg",
    rating: 5,
    title: "Perfect addition to my home office",
    comment: "Love this desk! It's sturdy and looks very modern. Assembly was straightforward.",
    isVerified: true,
    isApproved: true,
    helpfulCount: 8,
    createdAt: new Date("2023-09-22"),
    updatedAt: new Date("2023-09-22"),
  },
];

const mockOrders: Order[] = [
  {
    id: "order-1",
    orderDate: new Date("2023-10-01"),
    status: "completed",
    items: [
      { 
        id: "item-1", 
        productId: "product-1", 
        productName: "Modern Wooden Chair", 
        productImage: "/placeholder-chair.jpg", 
        price: 199.99, 
        quantity: 1,
        orderDate: new Date("2023-10-01"),
        status: "completed"
      },
      { 
        id: "item-2", 
        productId: "product-2", 
        productName: "Minimalist Coffee Table", 
        productImage: "/placeholder-table.jpg", 
        price: 149.99, 
        quantity: 1,
        orderDate: new Date("2023-10-01"),
        status: "completed"
      },
    ],
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [formData, setFormData] = useState<{
    rating: number;
    title: string;
    comment: string;
    productId: string;
    orderItemId?: string;
  }>({
    rating: 0,
    title: "",
    comment: "",
    productId: "",
    orderItemId: "",
  });
  const { toast } = useToast();

  // Load user's orders and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API calls - in a real app, these would be actual API calls
        const [ordersResponse, reviewsResponse] = await Promise.all([
          // Fetch user's completed orders
          Promise.resolve({
            data: mockOrders,
          }),
          // Fetch user's existing reviews
          Promise.resolve({ data: mockReviews }),
        ]);

        setOrders(ordersResponse.data);
        setReviews(reviewsResponse.data);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Get products that can be reviewed (purchased but not yet reviewed)
  const getReviewableProducts = () => {
    const reviewedProductIds = new Set(reviews.map(review => review.productId));
    
    return orders.flatMap(order => 
      order.items
        .filter(item => !reviewedProductIds.has(item.productId))
        .map(item => ({
          ...item,
          orderId: order.id,
          orderDate: order.orderDate,
        }))
    );
  };

  const reviewableProducts = getReviewableProducts();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number | string) => {
    setFormData((prev) => ({
      ...prev,
      rating: typeof rating === 'string' ? parseFloat(rating) : rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.rating) {
      toast({
        title: "Error",
        description: "Please select a product and provide a rating.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newReview: ReviewWithProduct = {
        id: editingReview ? editingReview.id : `review-${Date.now()}`,
        userId: "user-123", // Replace with actual user ID
        productId: formData.productId || "",
        rating: formData.rating as number,
        title: formData.title || "",
        comment: formData.comment || "",
        isVerified: true,
        isApproved: true,
        helpfulCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        productName: reviewableProducts.find(p => p.productId === formData.productId)?.productName || "",
        productImage: reviewableProducts.find(p => p.productId === formData.productId)?.productImage || "",
        orderItemId: formData.orderItemId || ""
      };

      if (editingReview) {
        // Update existing review
        setReviews(
          reviews.map((review) =>
            review.id === editingReview.id
              ? { 
                  ...review, 
                  ...newReview, 
                  updatedAt: new Date(),
                }
              : review
          )
        );
        toast({
          title: "Success",
          description: "Review updated successfully",
        });
      } else {
        // Add new review
        const newReview: ReviewWithProduct = {
          id: `temp-${Date.now()}`,
          userId: "user-123", // Replace with actual user ID from auth context
          productId: selectedProductData.productId,
          productName: selectedProductData.productName,
          productImage: selectedProductData.productImage,
          orderItemId: selectedProductData.id,
          rating: Number(formData.rating) || 0,
          title: formData.title || "",
          comment: formData.comment || "",
          isVerified: true,
          isApproved: true,
          helpfulCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        setReviews([newReview, ...reviews]);
        toast({
          title: "Success",
          description: "Thank you for your review!",
        });
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      setFormData({ rating: 0, title: "", comment: "" });
    } catch (error) {
      console.error("Failed to save review:", error);
      toast({
        title: "Error",
        description: "Failed to save review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (review: ReviewWithProduct) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title || "",
      comment: review.comment || "",
      productId: review.productId,
      orderItemId: review.orderItemId,
    });
    setShowReviewForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review
        )
      );
      
      toast({
        title: "Thank you!",
        description: "Your feedback helps other customers.",
      });
    } catch (error) {
      console.error("Failed to update helpful count:", error);
    }
  };

  const renderStars = (rating: number | string) => {
    // Convert string rating to number if needed
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    const stars = [];
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-[#B88E2F] text-[#B88E2F]" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-5 w-5 fill-[#B88E2F] text-[#B88E2F]" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B88E2F]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        {reviewableProducts.length > 0 && (
          <Button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-[#B88E2F] hover:bg-[#9a7628] text-white"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </Button>
        )}
      </div>

      {showReviewForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingReview ? "Edit Your Review" : "Write a Review"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingReview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product to Review
                </label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => {
                    const selected = reviewableProducts.find(p => p.productId === value);
                    setFormData(prev => ({
                      ...prev,
                      productId: value,
                      orderItemId: selected?.id || "",
                    }));
                  }}
                  disabled={!!editingReview}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewableProducts.length > 0 ? (
                      reviewableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.productId}>
                          {product.productName}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        No reviewable products found. You can only review products you've purchased.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.productId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      {star <= (formData.rating || 0) ? (
                        <Star className="h-8 w-8 fill-[#B88E2F] text-[#B88E2F]" />
                      ) : (
                        <Star className="h-8 w-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {formData.rating || 0} out of 5
                  </span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Review Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment || ""}
                onChange={handleInputChange}
                rows={4}
                placeholder="Share details about your experience with this product"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setFormData({ rating: 0, title: "", comment: "" });
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#B88E2F] hover:bg-[#9a7628] text-white"
              >
                {editingReview ? "Update Review" : "Submit Review"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {!isLoading && reviews.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">
              {reviewableProducts.length > 0 
                ? "No reviews yet" 
                : "No reviewable products found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {reviewableProducts.length > 0
                ? "You haven't written any reviews for your purchased products."
                : "You can only review products you've purchased. Complete an order to leave a review."}
            </p>
            {reviewableProducts.length > 0 && (
              <Button
                className="mt-4 bg-[#B88E2F] hover:bg-[#9a7628] text-white"
                onClick={() => setShowReviewForm(true)}
              >
                Write Your First Review
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {review.productName}
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {review.rating.toFixed(1)}
                        </span>
                        {review.isVerified && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <h4 className="mt-2 text-base font-semibold text-gray-900">
                          {review.title}
                        </h4>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-[#B88E2F]"
                        onClick={() => handleEdit(review)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="mt-2 text-sm text-gray-600">
                      {review.comment}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => handleHelpful(review.id)}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-[#B88E2F]"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
