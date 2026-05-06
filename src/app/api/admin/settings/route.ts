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

    let settings = await prisma.globalSettings.findUnique({
      where: { id: 'current' }
    });

    if (!settings) {
      settings = await prisma.globalSettings.create({
        data: { id: 'current' }
      });
    }

    return NextResponse.json(settings);
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

    const data = await req.json();
    const settings = await prisma.globalSettings.upsert({
      where: { id: 'current' },
      update: data,
      create: { id: 'current', ...data }
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
