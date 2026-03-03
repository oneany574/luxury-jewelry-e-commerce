'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Rings',
    stock: '',
    imageUrl: '',
    materials: '',
    weight: '',
    dimensions: '',
  });

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchProducts();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price) * 100,
          category: formData.category,
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl || null,
          materials: formData.materials.split(',').map((m) => m.trim()),
          weight: formData.weight ? parseFloat(formData.weight) : null,
          dimensions: formData.dimensions || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to create product');

      await fetchProducts();
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Rings',
        stock: '',
        imageUrl: '',
        materials: '',
        weight: '',
        dimensions: '',
      });
    } catch (err) {
      setError('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-4xl font-serif text-foreground">Product Management</h1>
              <p className="text-lg text-foreground/70 mt-2">Add and manage jewelry products</p>
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

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              + Add New Product
            </button>
          )}

          {showForm && (
            <div className="mb-8 bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif text-foreground mb-6">Add New Product</h2>

              <form onSubmit={handleAddProduct} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Rings</option>
                    <option>Necklaces</option>
                    <option>Bracelets</option>
                    <option>Earrings</option>
                    <option>Watches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Materials (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="Gold, Diamond, Platinum"
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Weight (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="10mm x 20mm"
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2 flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-lg border-2 border-primary text-primary px-6 py-3 text-center font-medium hover:bg-primary/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-lg text-foreground/70 mb-6">No products yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-card border-b-2 border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-foreground">${(product.price / 100).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.stock}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
