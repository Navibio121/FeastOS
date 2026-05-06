import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/mail";
import { sendOrderStatusSMS } from "@/lib/sms";
import eventEmitter, { EVENTS } from "@/lib/events";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: params.id },
          { id: { endsWith: params.id.toLowerCase() } }
        ]
      },
      include: {
        items: true,
        location: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Security: Only allow the owner or an admin to view the order
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const { id } = params;

    if (!status) {
      return NextResponse.json({ message: "Missing status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
      }
    });

    // Send status update email
    if (order.user.email) {
      sendStatusUpdateEmail(order.user.email, order.id, status);
    }
    
    // Send status update SMS
    if (order.phone) {
      sendOrderStatusSMS(order.phone, order.id, status);
    }

    // Emit real-time event
    eventEmitter.emit(EVENTS.ORDER_UPDATED, order);

    return NextResponse.json(order);
  } catch (error) {
    console.error("UPDATE_ORDER_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
