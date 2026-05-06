import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mood-to-Meal mapping engine — runs fully on the edge, no external API needed
// Maps moods to relevant dish characteristics using a multi-factor scoring algorithm

const MOOD_PROFILES: Record<string, {
  categories: string[];
  preferSpicy: boolean;
  preferVegan: boolean;
  priceRange: [number, number];
  keywords: string[];
  description: string;
  emoji: string;
}> = {
  adventurous: {
    categories: ['Mains', 'Specials', 'Starters'],
    preferSpicy: true,
    preferVegan: false,
    priceRange: [15, 999],
    keywords: ['exotic', 'fusion', 'spicy', 'bold', 'grilled', 'smoky'],
    description: "Bold, exciting dishes that push culinary boundaries",
    emoji: "🌶️"
  },
  romantic: {
    categories: ['Mains', 'Desserts', 'Specials'],
    preferSpicy: false,
    preferVegan: false,
    priceRange: [20, 999],
    keywords: ['rich', 'creamy', 'truffle', 'premium', 'wagyu', 'lobster', 'lamb'],
    description: "Indulgent, premium dishes perfect for a special evening",
    emoji: "🥂"
  },
  comfort: {
    categories: ['Mains', 'Starters', 'Sides'],
    preferSpicy: false,
    preferVegan: false,
    priceRange: [0, 25],
    keywords: ['warm', 'creamy', 'classic', 'homestyle', 'rich', 'hearty', 'pasta', 'burger'],
    description: "Warm, satisfying dishes that feel like a hug",
    emoji: "🍲"
  },
  healthy: {
    categories: ['Salads', 'Starters', 'Mains'],
    preferSpicy: false,
    preferVegan: true,
    priceRange: [0, 999],
    keywords: ['fresh', 'light', 'vegan', 'salad', 'grilled', 'steamed', 'organic'],
    description: "Nourishing, clean dishes full of vibrant flavors",
    emoji: "🥗"
  },
  celebratory: {
    categories: ['Specials', 'Mains', 'Desserts'],
    preferSpicy: false,
    preferVegan: false,
    priceRange: [25, 999],
    keywords: ['wagyu', 'lobster', 'truffle', 'premium', 'special', 'rich', 'deluxe'],
    description: "Showstopping dishes worthy of a major milestone",
    emoji: "🎉"
  },
  relaxed: {
    categories: ['Starters', 'Mains', 'Sides'],
    preferSpicy: false,
    preferVegan: false,
    priceRange: [0, 22],
    keywords: ['light', 'simple', 'classic', 'casual', 'fresh'],
    description: "Easy-going dishes for a laid-back evening",
    emoji: "😌"
  }
};

function scoreItem(item: any, profile: typeof MOOD_PROFILES[string]): number {
  let score = 0;

  // Category match
  if (profile.categories.includes(item.category)) score += 30;

  // Dietary match
  if (profile.preferVegan && item.isVegan) score += 25;
  if (profile.preferSpicy && item.isSpicy) score += 20;
  if (!profile.preferSpicy && !item.isSpicy) score += 10;

  // Price range match
  if (item.price >= profile.priceRange[0] && item.price <= profile.priceRange[1]) score += 20;

  // Keyword match in name or description
  const text = `${item.name} ${item.description}`.toLowerCase();
  profile.keywords.forEach(kw => {
    if (text.includes(kw)) score += 8;
  });

  // Stock availability bonus
  if (item.stock > 5) score += 5;

  return score;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mood, dietaryPreference, partySize, occasion } = body;

    if (!mood || !MOOD_PROFILES[mood]) {
      return NextResponse.json({ message: "Invalid mood selection" }, { status: 400 });
    }

    const profile = MOOD_PROFILES[mood];

    // Override vegan preference if specified
    if (dietaryPreference === 'vegan') profile.preferVegan = true;
    if (dietaryPreference === 'spicy') profile.preferSpicy = true;

    // Fetch all available menu items
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true }
    });

    // Score every item and sort descending
    const scored = items
      .map(item => ({ ...item, score: scoreItem(item, profile) }))
      .sort((a, b) => b.score - a.score);

    // Build a curated meal plan: 1 starter + 2 mains + 1 dessert
    const starters = scored.filter(i => i.category === 'Starters').slice(0, 2);
    const mains = scored.filter(i => i.category === 'Mains' || i.category === 'Specials').slice(0, 3);
    const desserts = scored.filter(i => i.category === 'Desserts').slice(0, 2);
    const sides = scored.filter(i => i.category === 'Sides').slice(0, 2);

    // Top picks — highest scoring regardless of category
    const topPicks = scored.slice(0, 5);

    const moodProfile = MOOD_PROFILES[mood];

    return NextResponse.json({
      mood,
      moodProfile: {
        description: moodProfile.description,
        emoji: moodProfile.emoji
      },
      curation: {
        starters,
        mains,
        desserts,
        sides,
      },
      topPicks,
      totalItems: scored.length
    });
  } catch (error) {
    console.error("MOOD_TO_MEAL_ERROR", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
