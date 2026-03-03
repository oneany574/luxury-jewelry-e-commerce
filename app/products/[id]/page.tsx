'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  materials: string[];
  weight: number | null;
  dimensions: string | null;
  stock: number;
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const params = useParams();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: params.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      setSuccess('Added to cart successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/70">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/70 mb-4">Product not found</p>
            <Link href="/products" className="text-primary hover:text-primary/80">
              Back to Products
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
          <Link href="/products" className="text-primary hover:text-primary/80 mb-8 inline-block">
            ← Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-card rounded-lg overflow-hidden h-96">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <span className="text-sm font-medium text-primary uppercase">
                  {product.category}
                </span>
                <h1 className="text-4xl font-serif text-foreground mt-2 mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-serif text-foreground">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                </div>

                {product.stock > 0 ? (
                  <p className="text-sm text-green-700">In Stock ({product.stock} available)</p>
                ) : (
                  <p className="text-sm text-red-700">Out of Stock</p>
                )}
              </div>

              {/* Materials & Specs */}
              {(product.materials.length > 0 || product.weight || product.dimensions) && (
                <div className="border-t border-border pt-6 space-y-4">
                  {product.materials.length > 0 && (
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Materials</h3>
                      <p className="text-sm text-foreground/70">
                        {product.materials.join(', ')}
                      </p>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Weight</h3>
                      <p className="text-sm text-foreground/70">{product.weight} g</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <h3 className="font-medium text-foreground mb-2">Dimensions</h3>
                      <p className="text-sm text-foreground/70">{product.dimensions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Add to Cart */}
              {product.stock > 0 && (
                <div className="border-t border-border pt-6 space-y-4">
                  {error && (
                    <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      {success}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-foreground hover:bg-muted"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 min-w-16 text-center text-foreground">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 text-foreground hover:bg-muted"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full rounded-lg bg-primary text-primary-foreground px-6 py-4 font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                  </button>

                  <button className="w-full rounded-lg border-2 border-primary text-primary px-6 py-4 font-medium hover:bg-primary/5 transition-colors">
                    Contact for Custom Design
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
