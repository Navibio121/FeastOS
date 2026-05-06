import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PAIRING_RULES: Record<string, { wine: string; description: string }> = {
  'Mains': {
    wine: 'Château Margaux 2015',
    description: 'A powerful yet elegant red that complements the rich umami of our signature steaks and slow-cooked stews.'
  },
  'Starters': {
    wine: 'Dom Pérignon Vintage',
    description: 'The crisp acidity and fine bubbles perfectly cleanse the palate between our bold, spicy appetizers.'
  },
  'Desserts': {
    wine: 'Château d\'Yquem',
    description: 'A legendary sweet wine with notes of honey and apricot that dances with our dark chocolate and gold leaf creations.'
  },
  'Seafood': {
    wine: 'Cloudy Bay Sauvignon Blanc',
    description: 'Vibrant and aromatic, this wine elevates the fresh, briny notes of our Atlantic seafood bounty.'
  }
};

export async function POST(req: Request) {
  try {
    const { message, cartItems } = await req.json();
    const prompt = message.toLowerCase();

    // Context-aware logic
    let response = "";
    
    if (prompt.includes('recommend') || prompt.includes('pairing') || prompt.includes('wine') || prompt.includes('drink')) {
      if (cartItems && cartItems.length > 0) {
        // Fetch full dish details for backstory context
        const firstItem = cartItems[0];
        const dish = await prisma.menuItem.findUnique({
          where: { id: firstItem.id }
        });

        const pairing = PAIRING_RULES[dish?.category || 'Mains'] || PAIRING_RULES['Mains'];
        
        response = `As your Sommelier, I've analyzed the ${dish?.name || 'selection'}. `;
        
        if (dish?.originStory) {
          response += `Given the cultural heritage of this dish—${dish.originStory.slice(0, 50)}...—I suggest pairing it with our **${pairing.wine}**. `;
        } else {
          response += `For this particular masterpiece, I highly recommend our **${pairing.wine}**. `;
        }
        
        response += `${pairing.description} It will create a magnificent sensory harmony with your feast.`;
      } else {
        response = "I would be delighted to assist. Once you select a masterpiece from our menu, I can suggest the perfect artisanal wine or cocktail pairing from our private cellar to complement its specific flavor profile.";
      }
    } else if (prompt.includes('spicy') || prompt.includes('hot')) {
      response = "For our guests who enjoy a vibrant heat, I recommend the **Smokey Party Jollof**. It features a complex blend of scotch bonnets that provides a lingering, sophisticated spice.";
    } else if (prompt.includes('special') || prompt.includes('chef')) {
      response = "The Chef's pride today is the **A5 Wagyu Burger**. It's a rare fusion of Japanese heritage and modern luxury, finished with black truffles harvested at their peak.";
    } else {
      response = "Welcome to the FeastOS Elite Circle. I am your culinary concierge. You may ask me for wine pairings, ingredient origins, or my personal recommendations for your evening.";
    }

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ response: "I apologize, my culinary knowledge is momentarily clouded. How else may I serve you?" }, { status: 500 });
  }
}

