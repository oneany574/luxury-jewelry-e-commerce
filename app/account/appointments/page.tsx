'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

interface Appointment {
  id: string;
  appointmentDate: string;
  type: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    type: 'CONSULTATION',
    notes: '',
  });

  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!formData.appointmentDate) {
        setError('Please select a date and time');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      await fetchAppointments();
      setShowForm(false);
      setFormData({ appointmentDate: '', type: 'CONSULTATION', notes: '' });
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
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
            <p className="text-lg text-foreground/70">Please log in to view appointments</p>
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
              <h1 className="text-4xl font-serif text-foreground">Your Appointments</h1>
              <p className="text-lg text-foreground/70 mt-2">Book jewelry consultations with our experts</p>
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

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              + Book New Appointment
            </button>
          )}

          {showForm && (
            <div className="mb-8 bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl font-serif text-foreground mb-6">Book an Appointment</h2>

              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.appointmentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, appointmentDate: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="CONSULTATION">General Consultation</option>
                    <option value="CUSTOM_DESIGN">Custom Design Discussion</option>
                    <option value="REPAIR">Repair & Maintenance</option>
                    <option value="APPRAISAL">Appraisal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-lg border border-border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us what you'd like to discuss..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
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
                    {isSubmitting ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-lg text-foreground/70 mb-6">No appointments booked yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90"
              >
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-serif text-foreground mb-1">
                        {appointment.type.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {new Date(appointment.appointmentDate).toLocaleDateString()} at{' '}
                        {new Date(appointment.appointmentDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-sm text-foreground/70 mb-1">Notes:</p>
                      <p className="text-sm text-foreground">{appointment.notes}</p>
                    </div>
                  )}

                  <p className="text-xs text-foreground/70">
                    Booked on {new Date(appointment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
