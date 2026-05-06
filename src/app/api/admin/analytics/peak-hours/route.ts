import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');

    const orders = await prisma.order.findMany({
      where: locationId && locationId !== 'all' ? { locationId } : {},
      select: { createdAt: true }
    });

    const hours = Array.from({ length: 24 }, (_, i) => ({ 
      hour: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`, 
      count: 0 
    }));
    
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hours[hour].count++;
    });

    return NextResponse.json(hours);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
