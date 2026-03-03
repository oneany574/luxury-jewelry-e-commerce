'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
  };
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export default function CartPage() {
  const { data: session } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchCart();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const fetchCart = async () => {
    try {
      // In a real app, you'd use the session token here
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) throw new Error('Failed to remove item');
      await fetchCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  if (!session) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-foreground/70">Please log in to view your cart</p>
            <Link
              href="/auth/login"
              className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <p className="text-foreground/70">Loading cart...</p>
        </div>
      </main>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-serif text-foreground mb-12">Shopping Cart</h1>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/70 mb-6">Your cart is empty</p>
              <Link
                href="/products"
                className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-6 bg-card rounded-lg border border-border"
                  >
                    <div className="h-32 w-32 flex-shrink-0 rounded-lg bg-muted overflow-hidden">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-serif text-lg text-foreground hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-2xl font-serif text-foreground">
                        ${(item.product.price / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-foreground/70">
                        Quantity: {item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-xl font-serif text-foreground">
                        ${((item.product.price / 100) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="h-fit sticky top-4 p-6 bg-card rounded-lg border border-border space-y-6">
                <h2 className="text-2xl font-serif text-foreground">Order Summary</h2>

                <div className="space-y-2 border-t border-border pt-6">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex justify-between text-xl font-serif text-foreground mb-6">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full rounded-lg bg-primary text-primary-foreground px-6 py-3 text-center font-medium hover:bg-primary/90 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/products"
                    className="block w-full rounded-lg border-2 border-primary text-primary px-6 py-3 text-center font-medium hover:bg-primary/5 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
