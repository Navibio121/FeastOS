import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        category: "asc",
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("GET_MENU_ITEMS_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
