import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');

    const reservations = await prisma.reservation.findMany({
      where: locationId && locationId !== 'all' ? { locationId } : {},
      include: {
        location: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
