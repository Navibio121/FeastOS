import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ message: "Missing coupon code" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ message: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ message: "Coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ message: "Coupon has expired" }, { status: 400 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("VALIDATE_COUPON_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
