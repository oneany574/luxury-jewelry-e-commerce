'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Luxe
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/products" className="text-sm text-gray-700 hover:text-gray-900">
                Products
              </Link>
              <Link href="/custom" className="text-sm text-gray-700 hover:text-gray-900">
                Custom Design
              </Link>
              <Link href="/about" className="text-sm text-gray-700 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/cart" className="text-sm text-gray-700 hover:text-gray-900">
                  Cart
                </Link>
                <Link href="/account" className="text-sm text-gray-700 hover:text-gray-900">
                  Account
                </Link>
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-gray-700 hover:text-gray-900">
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
