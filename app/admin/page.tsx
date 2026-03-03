'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function AdminDashboard() {
  const { data: session } = useSession();

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-foreground/70">You don't have permission to access this page</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const menuItems = [
    {
      title: 'Products',
      description: 'Manage jewelry products and inventory',
      href: '/admin/products',
      icon: '📿',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      href: '/admin/orders',
      icon: '📦',
    },
    {
      title: 'Appointments',
      description: 'Schedule and manage consultations',
      href: '/admin/appointments',
      icon: '📅',
    },
    {
      title: 'Customers',
      description: 'View customer information and history',
      href: '/admin/customers',
      icon: '👥',
    },
    {
      title: 'Analytics',
      description: 'View sales and engagement metrics',
      href: '/admin/analytics',
      icon: '📊',
    },
    {
      title: 'Settings',
      description: 'Manage admin settings and users',
      href: '/admin/settings',
      icon: '⚙️',
    },
  ];

  return (
    <main>
      <Navbar />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="text-4xl font-serif text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-lg text-foreground/70">Manage your jewelry business</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Products', value: '0', color: 'bg-blue-50' },
              { label: 'Pending Orders', value: '0', color: 'bg-yellow-50' },
              { label: 'Total Revenue', value: '$0.00', color: 'bg-green-50' },
              { label: 'Active Customers', value: '0', color: 'bg-purple-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.color} p-6 rounded-lg border border-border`}>
                <p className="text-sm text-foreground/70 mb-2">{stat.label}</p>
                <p className="text-3xl font-serif text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Management Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
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
    </main>
  );
}
