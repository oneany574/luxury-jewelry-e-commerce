import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-background py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-foreground tracking-tight">
              Timeless Elegance
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
              Discover exquisite luxury jewelry pieces. Each creation is a masterpiece of craftsmanship and design, celebrating your most precious moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/products"
                className="inline-block rounded-lg bg-primary text-primary-foreground px-8 py-4 font-medium hover:bg-primary/90 transition-colors"
              >
                Shop Collection
              </Link>
              <Link
                href="/custom"
                className="inline-block rounded-lg border-2 border-primary text-primary px-8 py-4 font-medium hover:bg-primary/5 transition-colors"
              >
                Design Custom Piece
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-serif text-center mb-16 text-foreground">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Engagement Rings', 'Necklaces', 'Bracelets'].map((collection) => (
              <div key={collection} className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-64 bg-muted" />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-serif text-foreground mb-2">{collection}</h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    Exquisite designs for every occasion
                  </p>
                  <Link
                    href={`/products?category=${collection.toLowerCase()}`}
                    className="text-primary font-medium hover:text-primary/80"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-foreground">
                Crafted with Passion
              </h2>
              <p className="text-lg text-foreground/70">
                Since 1995, we've been creating exceptional fine jewelry pieces that stand the test of time. Each piece is handcrafted by our master artisans using only the finest materials.
              </p>
              <ul className="space-y-3">
                {[
                  '100% Ethical Sourcing',
                  'Master Craftsmanship',
                  'Lifetime Guarantee',
                  'Custom Design Services',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-foreground/80">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-serif">Schedule a Personal Consultation</h2>
          <p className="text-lg opacity-90">
            Our jewelry experts are ready to help you find or create the perfect piece.
          </p>
          <Link
            href="/book-appointment"
            className="inline-block rounded-lg bg-primary-foreground text-primary px-8 py-4 font-medium hover:bg-primary-foreground/90 transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-serif mb-4">Luxe</h3>
              <p className="text-sm opacity-80">Timeless elegance in every piece.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/products" className="hover:opacity-100">All Products</Link></li>
                <li><Link href="/products?type=rings" className="hover:opacity-100">Rings</Link></li>
                <li><Link href="/products?type=necklaces" className="hover:opacity-100">Necklaces</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/about" className="hover:opacity-100">About Us</Link></li>
                <li><Link href="/contact" className="hover:opacity-100">Contact</Link></li>
                <li><Link href="/faq" className="hover:opacity-100">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/privacy" className="hover:opacity-100">Privacy</Link></li>
                <li><Link href="/terms" className="hover:opacity-100">Terms</Link></li>
                <li><Link href="/shipping" className="hover:opacity-100">Shipping</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 Luxe Jewelry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
