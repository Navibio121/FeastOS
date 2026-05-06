import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const location = await prisma.location.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        phone: data.phone,
        image: data.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
        lat: parseFloat(data.lat) || 6.5244,
        lng: parseFloat(data.lng) || 3.3792,
        isOpen: data.isOpen ?? true,
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error("CREATE_LOCATION_ERROR", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    if (updateData.lat) updateData.lat = parseFloat(updateData.lat);
    if (updateData.lng) updateData.lng = parseFloat(updateData.lng);

    const location = await prisma.location.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'ID required' }, { status: 400 });

    await prisma.location.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Location deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
