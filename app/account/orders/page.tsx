'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  if (!session) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-foreground/70">Please log in to view orders</p>
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

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif text-foreground">Your Orders</h1>
              <p className="text-lg text-foreground/70 mt-2">Track and manage your purchases</p>
            </div>
            <Link
              href="/account"
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Back to Account
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-lg text-foreground/70 mb-6">No orders yet</p>
              <Link
                href="/products"
                className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-serif text-foreground mb-1">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-border">
                    <h4 className="text-sm font-medium text-foreground/70 mb-2">Items:</h4>
                    <ul className="space-y-1">
                      {order.items.map((item) => (
                        <li key={item.id} className="text-sm text-foreground/80">
                          {item.product.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground/70 mb-1">Total</p>
                      <p className="text-2xl font-serif text-foreground">
                        ${(order.total / 100).toFixed(2)}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-2 font-medium hover:bg-primary/90 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
