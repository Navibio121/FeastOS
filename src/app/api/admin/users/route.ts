import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true, reservations: true }
        },
        orders: {
          select: { total: true }
        }
      },
      orderBy: { points: 'desc' }
    });

    // Map to include total spend and simplify
    const usersWithStats = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      points: user.points,
      orderCount: user._count.orders,
      reservationCount: user._count.reservations,
      totalSpend: user.orders.reduce((acc, o) => acc + o.total, 0),
    }));

    return NextResponse.json(usersWithStats);
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

    const body = await req.json();
    const { id, points, role } = body;

    if (!id) {
      return NextResponse.json({ message: 'Missing User ID' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        points: points !== undefined ? parseInt(points) : undefined,
        role: role || undefined
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("UPDATE_USER_ERROR", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
