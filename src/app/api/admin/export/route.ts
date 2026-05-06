import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "orders";
    const locationId = searchParams.get("locationId");

    let csv = "";

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        where: locationId && locationId !== "all" ? { locationId } : {},
        include: { items: true, location: true },
        orderBy: { createdAt: "desc" },
      });

      csv = [
        "Order ID,Date,Status,Total,Location,Address,Phone,Items",
        ...orders.map((o) =>
          [
            o.id,
            new Date(o.createdAt).toISOString(),
            o.status,
            o.total.toFixed(2),
            o.location?.name || "N/A",
            `"${o.address}"`,
            o.phone,
            `"${o.items.map((i) => `${i.quantity}x ${i.name}`).join("; ")}"`,
          ].join(",")
        ),
      ].join("\n");
    }

    if (type === "customers") {
      const users = await prisma.user.findMany({
        include: {
          orders: { select: { total: true } },
          _count: { select: { orders: true, reservations: true } },
        },
        orderBy: { points: "desc" },
      });

      csv = [
        "Name,Email,Role,Loyalty Points,Total Orders,Total Reservations,Lifetime Value",
        ...users.map((u) =>
          [
            `"${u.name || "Anonymous"}"`,
            u.email,
            u.role,
            u.points,
            u._count.orders,
            u._count.reservations,
            u.orders.reduce((acc, o) => acc + o.total, 0).toFixed(2),
          ].join(",")
        ),
      ].join("\n");
    }

    if (type === "inventory") {
      const items = await prisma.menuItem.findMany({
        orderBy: { stock: "asc" },
      });

      csv = [
        "ID,Name,Category,Price,Stock,Is Vegan,Is Spicy,Available",
        ...items.map((i) =>
          [
            i.id,
            `"${i.name}"`,
            i.category,
            i.price.toFixed(2),
            i.stock,
            i.isVegan,
            i.isSpicy,
            i.isAvailable,
          ].join(",")
        ),
      ].join("\n");
    }

    if (type === "reservations") {
      const reservations = await prisma.reservation.findMany({
        include: { user: true, location: true },
        orderBy: { date: "desc" },
      });

      csv = [
        "ID,Guest Name,Email,Date,Time,Party Size,Status,Location,Special Requests",
        ...reservations.map((r) =>
          [
            r.id,
            `"${r.name}"`,
            r.email || r.user?.email || "Guest",
            r.date,
            r.time,
            r.guests,
            r.status,
            `"${r.location?.name || "N/A"}"`,
            `"${r.specialRequest || ""}"`,
          ].join(",")
        ),
      ].join("\n");
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="feastos_${type}_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV_EXPORT_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
