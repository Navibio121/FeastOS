import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/mail";
import { sendSMS } from "@/lib/sms";
import eventEmitter, { EVENTS } from "@/lib/events";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { items, total, address, phone, locationId } = await req.json();

    if (!items || items.length === 0 || !total || !address || !phone) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        total,
        address,
        phone,
        locationId,
        userId: session.user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Decrement stock for each item
    for (const item of items) {
      const exists = await prisma.menuItem.findUnique({ where: { id: item.id } });
      if (exists) {
        await prisma.menuItem.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        console.warn(`Item ${item.id} not found in database, skipping stock update.`);
      }
    }

    // Award loyalty points (1 point per $1 spent, rounded down)
    const pointsEarned = Math.floor(total);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { points: { increment: pointsEarned } },
    });

    // Send confirmation email asynchronously
    if (session.user.email) {
      sendOrderEmail(session.user.email, order);
    }
    if (phone) {
      sendSMS(phone, `FeastOS: Order #${order.id.slice(-6).toUpperCase()} placed successfully! Total: $${total.toFixed(2)}`);
    }

    // Emit real-time event for KDS
    eventEmitter.emit(EVENTS.NEW_ORDER, order);

    return NextResponse.json({ ...order, pointsEarned }, { status: 201 });
  } catch (error) {
    console.error("ORDER_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
