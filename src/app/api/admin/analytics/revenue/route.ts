import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, subDays, format } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');

    // Get last 7 days of revenue
    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const revenueData = await Promise.all(days.map(async (day) => {
      const start = new Date(day);
      const end = new Date(new Date(day).setDate(new Date(day).getDate() + 1));

      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: start,
            lt: end,
          },
          ...(locationId && locationId !== 'all' ? { locationId } : {}),
        },
        select: { total: true },
      });

      const total = orders.reduce((acc, o) => acc + o.total, 0);
      return {
        date: format(start, 'MMM dd'),
        revenue: total,
      };
    }));

    return NextResponse.json(revenueData);
  } catch (error) {
    return NextResponse.json({ message: 'Analytics Error' }, { status: 500 });
  }
}
