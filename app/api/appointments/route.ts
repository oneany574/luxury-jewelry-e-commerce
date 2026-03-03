import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { sendAppointmentConfirmation } from '@/lib/email';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const adminOnly = searchParams.get('admin') === 'true';

    if (adminOnly) {
      // Admin can see all appointments
      const appointments = await prisma.appointment.findMany({
        include: { user: true },
        orderBy: { appointmentDate: 'asc' },
      });
      return NextResponse.json(appointments);
    }

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authHeader.split(' ')[1];
    const appointments = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { appointmentDate: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('[v0] GET /api/appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = session.user.id;

    // Get user data for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        appointmentDate: new Date(body.appointmentDate),
        notes: body.notes || null,
        type: body.type || 'CONSULTATION',
      },
    });

    // Send confirmation email
    const appointmentDate = new Date(body.appointmentDate);
    const dateStr = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = appointmentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await sendAppointmentConfirmation(
      user.email,
      user.name || 'Valued Customer',
      dateStr,
      timeStr,
      body.type || 'Jewelry Consultation'
    );

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('POST /api/appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const appointment = await prisma.appointment.update({
      where: { id: body.appointmentId },
      data: {
        status: body.status || undefined,
        notes: body.notes || undefined,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('[v0] PATCH /api/appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}
