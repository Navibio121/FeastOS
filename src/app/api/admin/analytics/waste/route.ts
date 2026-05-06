import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Waste by reason
    const wasteByReason = await prisma.wasteLog.groupBy({
      by: ['reason'],
      _sum: {
        quantity: true
      }
    });

    // Waste by item (top 5 wasted items)
    const wasteByItem = await prisma.wasteLog.groupBy({
      by: ['menuItemId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    // Get item names for wasteByItem
    const itemIds = wasteByItem.map(w => w.menuItemId);
    const items = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, name: true }
    });

    const formattedWasteByItem = wasteByItem.map(w => ({
      name: items.find(i => i.id === w.menuItemId)?.name || 'Unknown',
      quantity: w._sum.quantity || 0
    }));

    return NextResponse.json({
      byReason: wasteByReason.map(w => ({ name: w.reason, value: w._sum.quantity || 0 })),
      byItem: formattedWasteByItem
    });
  } catch (error) {
    console.error("WASTE_ANALYTICS_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
