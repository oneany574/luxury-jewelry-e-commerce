'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function AccountPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-foreground/70">Please log in to access your account</p>
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

  const navigationItems = [
    {
      title: 'Orders',
      description: 'View and track your orders',
      href: '/account/orders',
      icon: '📦',
    },
    {
      title: 'Appointments',
      description: 'Manage your jewelry consultations',
      href: '/account/appointments',
      icon: '📅',
    },
    {
      title: 'Custom Designs',
      description: 'View your custom design requests',
      href: '/account/designs',
      icon: '✨',
    },
    {
      title: 'Wishlist',
      description: 'Save your favorite pieces',
      href: '/account/wishlist',
      icon: '❤️',
    },
    {
      title: 'Settings',
      description: 'Update your profile and preferences',
      href: '/account/settings',
      icon: '⚙️',
    },
    {
      title: 'Help & Support',
      description: 'Contact our support team',
      href: '/account/support',
      icon: '💬',
    },
  ];

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-foreground mb-4">
              Welcome, {session.user?.name || 'Customer'}
            </h1>
            <p className="text-lg text-foreground/70">
              Manage your account, orders, and custom jewelry designs
            </p>
          </div>

          {/* Account Overview Card */}
          <div className="mb-12 bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-serif text-foreground mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-foreground/70 mb-1">Full Name</p>
                <p className="text-lg text-foreground font-medium">{session.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">Email Address</p>
                <p className="text-lg text-foreground font-medium">{session.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">Account Type</p>
                <p className="text-lg text-foreground font-medium capitalize">
                  {session.user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}
                </p>
              </div>
              <div>
                <p className="text-sm text-foreground/70 mb-1">Member Since</p>
                <p className="text-lg text-foreground font-medium">
                  {new Date(session.user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Link
                href="/account/settings"
                className="inline-block text-primary hover:text-primary/80 font-medium"
              >
                Edit Profile →
              </Link>
            </div>
          </div>

          {/* Navigation Grid */}
          <div>
            <h2 className="text-2xl font-serif text-foreground mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group p-6 bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-foreground group-hover:text-primary transition-colors mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
