"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { X, Truck, CreditCard, MapPin, Package, CheckCircle2, Printer } from "lucide-react";
import { Order } from "@/app/(account)/orders/page";
import { useRef } from "react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (!order) return null;

  const getStatusIcon = () => {
    const iconClass = "h-5 w-5 mr-2";
    
    switch (order.status) {
      case "delivered":
        return <CheckCircle2 className={`${iconClass} text-green-500`} />;
      case "shipped":
        return <Truck className={`${iconClass} text-blue-500`} />;
      case "processing":
        return <Package className={`${iconClass} text-amber-500`} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[90vw] md:w-[60vw] md:max-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="flex items-center">
              {getStatusIcon()}
              Order #{order.id}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Order Items</h3>
              <div className="border rounded-lg divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-start space-x-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                      <p className="mt-1 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(order.total * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${(order.total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Delivery Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="capitalize">{order.status}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-muted-foreground">Tracking Number</p>
                    <p>{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-muted-foreground">
                      {order.status === 'delivered' ? 'Delivered on' : 'Estimated Delivery'}
                    </p>
                    <p>{format(order.estimatedDelivery, 'MMMM d, yyyy')}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </h3>
              <div className="space-y-1 text-sm">
                <p>John Doe</p>
                <p>123 Main St</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
                <p className="mt-2">Phone: (123) 456-7890</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h3>
              <div className="text-sm">
                <p>Visa ending in 4242</p>
                <p className="text-muted-foreground">Billing address same as shipping</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
