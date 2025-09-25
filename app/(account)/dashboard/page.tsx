"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { ShoppingCart, Heart, MapPin, Package, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignOut } from "@/components/auth/sign-out";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface StatType {
  name: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export default function DashboardPage() {
  const [authSession] = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatType[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        const mockStats: StatType[] = [
          {
            name: "Total Orders",
            value: "12",
            change: "+2.1%",
            changeType: "positive",
          },
          {
            name: "Wishlist Items",
            value: "8",
            change: "+5.2%",
            changeType: "positive",
          },
          {
            name: "Saved Addresses",
            value: "3",
            change: "0%",
            changeType: "neutral",
          },
        ];
        setStats(mockStats);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {authSession.user?.name || "User"}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>
        <div>
          <SignOut />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card 
            key={stat.name}
            className="relative overflow-hidden border ${
              stat.name === 'Total Orders' ? 'bg-blue-50 border-blue-100' : 
              stat.name === 'Wishlist Items' ? 'bg-pink-50 border-pink-100' : 
              'bg-green-50 border-green-100'
            }"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                stat.name === 'Total Orders' ? 'text-blue-500 bg-blue-100' : 
                stat.name === 'Wishlist Items' ? 'text-pink-500 bg-pink-100' : 
                'text-green-500 bg-green-100'
              }`}>
                {stat.name === "Total Orders" && <ShoppingCart className="h-5 w-5" />}
                {stat.name === "Wishlist Items" && <Heart className="h-5 w-5" />}
                {stat.name === "Saved Addresses" && <MapPin className="h-5 w-5" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-500"
                    : stat.changeType === "negative"
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-background border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-muted/30 mb-2 last:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mr-3">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Order #12345</p>
                <p className="text-sm text-muted-foreground">
                  Placed on September 20, 2023
                </p>
              </div>
              <div className="ml-auto flex items-center">
                <span className="font-medium">$129.99</span>
                <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-muted/30 mb-2 last:mb-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mr-3">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Order #12344</p>
                <p className="text-sm text-muted-foreground">
                  Placed on September 15, 2023
                </p>
              </div>
              <div className="ml-auto flex items-center">
                <span className="font-medium">$89.99</span>
                <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
