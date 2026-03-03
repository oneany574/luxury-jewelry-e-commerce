import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = authHeader.split(' ')[1];

    // Check if user is trying to book appointment without being logged in
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('[v0] POST /api/appointments error:', error);
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
