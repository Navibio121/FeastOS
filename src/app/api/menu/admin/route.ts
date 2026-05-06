import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, category, image, isVegan, isSpicy, isAvailable, stock } = body;

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category,
        image,
        isVegan: !!isVegan,
        isSpicy: !!isSpicy,
        isAvailable: isAvailable !== undefined ? !!isAvailable : true,
        stock: parseInt(stock) || 0,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("CREATE_MENU_ITEM_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock);

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data,
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("UPDATE_MENU_ITEM_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing ID" }, { status: 400 });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE_MENU_ITEM_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
