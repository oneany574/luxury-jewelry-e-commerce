'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{ quantity: number; price: number }>;
}

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      // Since we don't have an admin-specific orders endpoint yet, 
      // this would need to be implemented in the API
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load orders');
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

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-foreground/70">Unauthorized access</p>
            <Link href="/" className="inline-block text-primary hover:text-primary/80">
              Go Home
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
              <h1 className="text-4xl font-serif text-foreground">Orders Management</h1>
              <p className="text-lg text-foreground/70 mt-2">Track and manage all customer orders</p>
            </div>
            <Link
              href="/admin"
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Back to Dashboard
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
              <p className="text-lg text-foreground/70">No orders yet</p>
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
                        {order.user.name} ({order.user.email})
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
                    <div>
                      <p className="text-xs text-foreground/70 mb-1">Total</p>
                      <p className="text-xl font-serif text-foreground">
                        ${(order.total / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/70 mb-1">Items</p>
                      <p className="text-xl font-serif text-foreground">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/70 mb-1">Date</p>
                      <p className="text-sm text-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-block text-primary hover:text-primary/80 font-medium"
                    >
                      View Details →
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
