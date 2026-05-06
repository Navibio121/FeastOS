import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const moodId = searchParams.get('moodId');

    // If mood is provided, prioritize mood-based recommendations
    if (moodId) {
      const moodMap: Record<string, string[]> = {
        adventurous: ['Spicy', 'Nigerian', 'Seafood'],
        luxury: ['Premium', 'Luxury', 'Wagyu'],
        comfort: ['Traditional', 'Warm', 'Comfort'],
        productive: ['Healthy', 'Clean', 'Protein'],
        peaceful: ['Classic', 'Dessert', 'Wine'],
      };
      
      const categories = moodMap[moodId] || [];
      if (categories.length > 0) {
        const moodRecs = await prisma.menuItem.findMany({
          where: {
            OR: categories.map(cat => ({ category: { contains: cat } }))
          },
          take: 3,
        });
        if (moodRecs.length > 0) return NextResponse.json(moodRecs);
      }
    }

    // If guest or no mood, return personalized if logged in, otherwise featured
    if (session?.user) {
      // Get user's previous orders to find favorite categories
      const previousOrders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        take: 10,
      });

      const categoryWeights: Record<string, number> = {};
      
      if (previousOrders.length > 0) {
        for (const order of previousOrders) {
          for (const item of order.items) {
            const menuItem = await prisma.menuItem.findFirst({
              where: { name: item.name },
              select: { category: true }
            });
            if (menuItem) {
              categoryWeights[menuItem.category] = (categoryWeights[menuItem.category] || 0) + 1;
            }
          }
        }

        const favoriteCategory = Object.entries(categoryWeights)
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        if (favoriteCategory) {
          const recommendations = await prisma.menuItem.findMany({
            where: { category: favoriteCategory },
            take: 3,
            orderBy: { price: 'desc' }
          });
          return NextResponse.json(recommendations);
        }
      }
    }

    // Default: Return trending items
    const trending = await prisma.menuItem.findMany({
      take: 3,
      orderBy: { updatedAt: 'desc' } 
    });
    
    return NextResponse.json(trending);
  } catch (error) {
    console.error("AI_RECOMMENDATION_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
