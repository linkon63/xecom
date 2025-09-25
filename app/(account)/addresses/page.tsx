"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Check, MapPin, Home, Briefcase, Phone, Map, Mail, User, Truck, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Address, NewAddress } from "@/db/schema/addresses";
import { AddressForm } from "@/components/addresses/address-form";
import { ConfirmDialog } from "@/components/addresses/confirm-dialog";
import { useToast } from "@/components/ui/use-toast";

// Mock data - replace with actual API calls
const mockAddresses: Address[] = [
  {
    id: "1",
    userId: "user-123",
    type: "shipping",
    firstName: "John",
    lastName: "Doe",
    company: "Acme Inc",
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "user-123",
    type: "billing",
    firstName: "John",
    lastName: "Doe",
    company: null,
    address1: "456 Billing Ave",
    address2: null,
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phone: null, // Explicitly set to null instead of undefined
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load addresses - replace with actual API call
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAddresses(mockAddresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        toast({
          title: "Error",
          description: "Failed to load addresses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [toast]);

  const handleSaveAddress = async (address: NewAddress) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingAddress) {
        // Update existing address
        setAddresses(
          addresses.map((addr) =>
            addr.id === editingAddress.id
              ? { ...addr, ...address, updatedAt: new Date() }
              : addr
          )
        );
        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        // Add new address
        const newAddress: Address = {
          id: `temp-${Date.now()}`, // Temporary ID for local state management
          userId: "user-123", // Replace with actual user ID from your auth context
          type: address.type || "shipping",
          firstName: address.firstName,
          lastName: address.lastName,
          address1: address.address1,
          address2: address.address2 || null,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone || null,
          company: address.company || null,
          isDefault: address.isDefault || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setAddresses([...addresses, newAddress]);
        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      setIsFormOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAddresses(addresses.filter((addr) => addr.id !== addressToDelete));
      setAddressToDelete(null);

      toast({
        title: "Success",
        description: "Address deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );

      toast({
        title: "Success",
        description: "Default address updated",
      });
    } catch (error) {
      console.error("Failed to update default address:", error);
      toast({
        title: "Error",
        description: "Failed to update default address. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
        <Button
          onClick={() => {
            setEditingAddress(null);
            setIsFormOpen(true);
          }}
          className="bg-[#B88E2F] hover:bg-[#9a7628] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-[150px]">Contact</TableHead>
              <TableHead className="w-[150px] text-center">Default</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {address.type === "shipping" ? (
                      <Truck className="h-4 w-4 text-blue-500" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-purple-500" />
                    )}
                    <span>{address.type === "shipping" ? "Shipping" : "Billing"}</span>
                    {address.isDefault && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        <Check className="h-3 w-3 mr-1" /> Default
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="space-y-1 flex justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{address.firstName} {address.lastName}</span>
                    </div>
                    {address.company && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{address.company}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <Map className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-x-2 items-baseline overflow-hidden">
                          <span className="truncate">{address.address1}</span>
                          {address.address2 && <span className="truncate">, {address.address2}</span>}
                          <span className="truncate">, {address.city}, {address.state} {address.postalCode}</span>
                          <span className="truncate">, {address.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {address.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{address.phone}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant={address.isDefault ? "outline" : "ghost"}
                    size="sm"
                    className={`w-full justify-center ${address.isDefault ? 'cursor-default' : ''}`}
                    onClick={() => !address.isDefault && handleSetDefault(address.id)}
                    disabled={address.isDefault}
                  >
                    {address.isDefault ? (
                      <span className="flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Default
                      </span>
                    ) : (
                      "Set as Default"
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingAddress(address);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setAddressToDelete(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && addresses.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No addresses saved</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You haven't added any addresses yet.
          </p>
          <Button
            className="mt-4"
            onClick={() => {
              setEditingAddress(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </div>
      )}

      <AddressForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingAddress(null);
        }}
        address={editingAddress}
        onSave={handleSaveAddress}
      />

      <ConfirmDialog
        open={!!addressToDelete}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
        onConfirm={handleDeleteAddress}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
      />
    </div>
  );
}
