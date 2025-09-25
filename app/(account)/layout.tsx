// app/(account)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, MapPin, Star, Heart, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated") {
      setIsLoading(false);
    }
  }, [status, router]);

  const navItems = [
    { name: "Dashboard", href: "/account/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/account/orders", icon: Package },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Reviews", href: "/account/reviews", icon: Star },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Settings", href: "/account/settings", icon: UserCog },
  ];

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 overflow-hidden w-full">
      <div className="grid grid-cols-1 xl:grid-cols-6 xl:gap-10">
        <div className="flex justify-center xl:relative xl:col-span-1 xl:border-r-1 xl:pr-6 xl:border-l-[#B88E2F]">
          <div className="xl:space-y-2 mt-20 my-0 xl:my-20 py-4 flex xl:flex-col xl:justify-start">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="xl:col-span-5 py-10">{children}</div>
      </div>
    </div>
  );
}