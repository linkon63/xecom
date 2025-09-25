"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OrderDetailsModal } from "@/components/orders/order-details-modal";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Mock data - replace with actual data from your API
const mockOrders: Order[] = [
  {
    id: "ORD-2023-001",
    date: new Date(2023, 8, 15),
    status: "delivered",
    items: [
      {
        id: "item-1",
        name: "Modern Wooden Chair",
        price: 199.99,
        quantity: 2,
        image: "/vintage-armchair-stools-vase.png"
      },
      {
        id: "item-2",
        name: "Minimalist Coffee Table",
        price: 249.99,
        quantity: 1,
        image: "/vintage-armchair-stools-vase.png"
      }
    ],
    total: 649.97,
    trackingNumber: "1Z999AA1234567890",
    estimatedDelivery: new Date(2023, 8, 20)
  },
  {
    id: "ORD-2023-002",
    date: new Date(2023, 8, 5),
    status: "shipped",
    items: [
      {
        id: "item-3",
        name: "Luxury King Size Bed",
        price: 1299.99,
        quantity: 1,
        image: "/vintage-armchair-stools-vase.png"
      }
    ],
    total: 1299.99,
    trackingNumber: "1Z999BB1234567890",
    estimatedDelivery: new Date(2023, 9, 1)
  },
  {
    id: "ORD-2023-003",
    date: new Date(2023, 7, 28),
    status: "processing",
    items: [
      {
        id: "item-4",
        name: "Ergonomic Office Chair",
        price: 349.99,
        quantity: 1,
        image: "/vintage-armchair-stools-vase.png"
      }
    ],
    total: 349.99
  }
];

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
    case "shipped":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>;
    case "processing":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Processing</Badge>;
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
const getStatusIcon = (status: OrderStatus) => {
  const iconClass = "h-5 w-5";
  
  switch (status) {
    case "delivered":
      return <CheckCircle2 className={`${iconClass} text-green-500`} />;
    case "shipped":
      return <Truck className={`${iconClass} text-blue-500`} />;
    case "processing":
      return <Clock className={`${iconClass} text-amber-500`} />;
    case "cancelled":
      return <XCircle className={`${iconClass} text-destructive`} />;
    default:
      return <Package className={iconClass} />;
  }
};

// Export the Order type for use in other components
export interface Order {
  id: string;
  date: Date;
  status: OrderStatus;
  items: OrderProduct[];
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredOrders = activeTab === "all" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeTab);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">No orders found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activeTab === "all" 
                    ? "You haven't placed any orders yet." 
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-md bg-primary/10 p-2">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(order.date, 'MMMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${order.total.toFixed(2)}</div>
                          <div className="mt-1">{getStatusBadge(order.status)}</div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="h-16 w-16 overflow-hidden rounded-md border">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.trackingNumber && (
                        <div className="pt-2 text-sm">
                          <div className="font-medium">Tracking Information</div>
                          <div className="text-muted-foreground">
                            {order.status === 'delivered' 
                              ? `Delivered on ${format(order.estimatedDelivery!, 'MMMM d, yyyy')}`
                              : `Estimated delivery: ${format(order.estimatedDelivery!, 'MMMM d, yyyy')}`}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <Truck className="mr-1 h-4 w-4" />
                            <span>Tracking #: {order.trackingNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t p-4 md:border-t-0 md:border-l md:px-6 md:py-4">
                    <div className="flex h-full flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="font-medium">Order Actions</h4>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-between"
                            onClick={() => handleViewDetails(order)}
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" className="w-full">
                              Leave a Review
                            </Button>
                          )}
                          {['processing', 'shipped'].includes(order.status) && (
                            <Button variant="outline" className="w-full" disabled={order.status !== 'shipped'}>
                              Track Order
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="outline" className="mt-4 w-full">
                        Buy Again
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
