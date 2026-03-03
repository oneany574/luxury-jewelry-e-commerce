'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate shipping address
    if (
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({
          shippingAddress: JSON.stringify(shippingAddress),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <p className="text-foreground/70">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-serif text-foreground mb-12">Checkout</h1>

          {/* Progress Steps */}
          <div className="mb-12 flex items-center justify-between">
            <div
              className={`flex-1 h-1 ${
                step === 1 ? 'bg-primary' : step > 1 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div className="mx-4 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground/70'
                }`}
              >
                1
              </div>
              <p className="text-sm mt-2 text-foreground">Shipping</p>
            </div>
            <div
              className={`flex-1 h-1 ${
                step > 1 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div className="mx-4 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground/70'
                }`}
              >
                2
              </div>
              <p className="text-sm mt-2 text-foreground">Payment</p>
            </div>
            <div
              className={`flex-1 h-1 ${
                step > 2 ? 'bg-primary' : 'bg-muted'
              }`}
            />
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          {step === 1 ? (
            // Shipping Address Form
            <form onSubmit={handleSubmitShipping} className="space-y-6">
              <div className="bg-card p-8 rounded-lg border border-border space-y-6">
                <h2 className="text-2xl font-serif text-foreground">Shipping Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleAddressChange}
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Link
                    href="/cart"
                    className="flex-1 rounded-lg border-2 border-primary text-primary px-6 py-3 text-center font-medium hover:bg-primary/5"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // Payment/Review
            <div className="space-y-6">
              <div className="bg-card p-8 rounded-lg border border-border space-y-6">
                <h2 className="text-2xl font-serif text-foreground">Order Review</h2>

                <div className="border-t border-border pt-6 space-y-3 text-sm">
                  <p>
                    <span className="text-foreground/70">Name:</span>{' '}
                    <span className="text-foreground">{shippingAddress.fullName}</span>
                  </p>
                  <p>
                    <span className="text-foreground/70">Email:</span>{' '}
                    <span className="text-foreground">{shippingAddress.email}</span>
                  </p>
                  <p>
                    <span className="text-foreground/70">Address:</span>{' '}
                    <span className="text-foreground">
                      {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}{' '}
                      {shippingAddress.zipCode}
                    </span>
                  </p>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <p className="text-foreground/70">
                    Please verify your information above. Payment processing coming soon!
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">Next Step</p>
                    <p>Stripe payment integration will be implemented in the next phase.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border-2 border-primary text-primary px-6 py-3 text-center font-medium hover:bg-primary/5"
                  >
                    Edit Shipping
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex-1 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
