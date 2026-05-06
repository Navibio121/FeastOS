import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['PENDING', 'PREPARING', 'READY']
        }
      },
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('KDS Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { user: true }
    });

    // Create Notification
    const notificationMessages: Record<string, string> = {
      'PREPARING': 'Your order is now being prepared by our master chefs.',
      'READY': 'Your feast is ready and on its way to you!',
      'COMPLETED': 'Thank you for dining with FeastOS. We hope you enjoyed your meal!',
    };

    if (notificationMessages[status]) {
      await prisma.notification.create({
        data: {
          userId: updatedOrder.userId,
          title: `Order Update: ${status}`,
          message: notificationMessages[status],
          type: 'ORDER'
        }
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('KDS Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
