import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSMS } from "@/lib/sms";
import eventEmitter, { EVENTS } from "@/lib/events";
import { sendReservationEmail } from "@/lib/mail";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, guests, zone, name, email, phone, specialRequest } = body;

    if (!date || !time || !guests || !zone || !name || !email || !phone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    const reservation = await prisma.reservation.create({
      data: {
        date,
        time,
        guests: parseInt(guests),
        zone,
        name,
        email,
        phone,
        specialRequest: specialRequest || null,
        userId: session?.user?.id || null,
      },
    });

    // Send mock SMS confirmation
    if (phone) {
      sendSMS(phone, `FeastOS: Reservation confirmed for ${date} at ${time}. We look forward to seeing you!`);
    }

    // Emit real-time event for admin notification
    eventEmitter.emit(EVENTS.NEW_RESERVATION, reservation);

    // Send email confirmation
    if (email) {
      await sendReservationEmail(email, reservation);
    }

    return NextResponse.json(reservation, { status: 201 });

  } catch (error) {
    console.error("RESERVATION_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("GET_RESERVATIONS_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
