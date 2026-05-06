import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');

    // Get order items count, optionally filtered by location
    const orderItems = await prisma.orderItem.findMany({
      where: locationId ? {
        order: {
          locationId: locationId
        }
      } : {},
      select: {
        name: true,
        quantity: true,
      },
    });

    // Aggregate counts
    const dishCounts: Record<string, number> = {};
    orderItems.forEach(item => {
      dishCounts[item.name] = (dishCounts[item.name] || 0) + item.quantity;
    });

    // Sort and take top 5
    const topDishes = Object.entries(dishCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json(topDishes);
  } catch (error) {
    console.error("GET_ANALYTICS_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
