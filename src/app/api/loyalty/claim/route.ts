import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PERKS = {
  p1: { name: '10% Welcome Discount', threshold: 0, discount: 10 },
  p2: { name: 'Free Delivery', threshold: 200, discount: 100 }, // Simulated as 100% off delivery
  p3: { name: 'Priority Booking', threshold: 500, discount: 0 }, // Status perk
  p4: { name: 'Private Chef Event', threshold: 1000, discount: 0 }, // High-end perk
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { perkId } = await req.json();
    const perk = PERKS[perkId as keyof typeof PERKS];

    if (!perk) {
      return NextResponse.json({ message: "Invalid perk" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true }
    });

    if (!user || user.points < perk.threshold) {
      return NextResponse.json({ message: "Insufficient points for this tier" }, { status: 403 });
    }

    // Generate a unique coupon code
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const couponCode = `FEAST-${perkId.toUpperCase()}-${shortId}`;

    // Create the coupon in DB
    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        discount: perk.discount,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
      }
    });

    return NextResponse.json({ 
      message: "Perk claimed successfully!", 
      code: couponCode,
      perk: perk.name 
    });
  } catch (error) {
    console.error("CLAIM_PERK_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
