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

    const wasteLogs = await prisma.wasteLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(wasteLogs);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { menuItemId, quantity, reason, staffName } = body;

    const wasteLog = await prisma.$transaction(async (tx) => {
      const log = await tx.wasteLog.create({
        data: {
          menuItemId,
          quantity: parseInt(quantity),
          reason,
          staffName: staffName || session.user.name
        }
      });

      await tx.menuItem.update({
        where: { id: menuItemId },
        data: {
          stock: {
            decrement: parseInt(quantity)
          }
        }
      });

      return log;
    });

    return NextResponse.json(wasteLog, { status: 201 });
  } catch (error) {
    console.error("WASTE_LOG_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
