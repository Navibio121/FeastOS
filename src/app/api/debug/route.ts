import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  const debugInfo: any = {
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length || 0,
      databaseUrlStart: process.env.DATABASE_URL?.substring(0, 15) + "...",
    },
    prisma: "unknown",
    locationsCount: 0,
    error: null,
  };

  try {
    const count = await prisma.location.count();
    debugInfo.prisma = "connected";
    debugInfo.locationsCount = count;
  } catch (error: any) {
    debugInfo.prisma = "failed";
    debugInfo.error = error.message;
  }

  return NextResponse.json(debugInfo);
}
