const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUNNING_MENU = [
  // --- Nigerian Local ---
  {
    name: 'Smokey Party Jollof',
    description: 'The legendary Nigerian party jollof rice, parboiled with rich tomato base and native spices, served with grilled peppered chicken and plantain.',
    price: 18.50,
    category: 'Mains',
    image: '/slider/slide_1_jollof_1777427720491.png',
    ingredients: 'Long-grain rice, Plum tomatoes, Red bell peppers, Scotch bonnet, Thyme, Curry, Bay leaves, Smoked paprika',
    isSpicy: true,
    originStory: 'Inspired by the high-octane energy of Lagos street festivals, our Chef perfected the smokey essence by charcoal-firing the tomato base for 4 hours, capturing the true "Party Jollof" spirit that defines Nigerian celebration.',
  },
  {
    name: 'Pounded Yam & Egusi Deluxe',
    description: 'Smooth pounded yam paired with rich melon seed soup, fortified with assorted meats, stockfish, and fresh spinach.',
    price: 22.00,
    category: 'Mains',
    image: '/slider/slide_3_egusi_1777427855062.png',
    ingredients: 'Yam, Melon seeds (Egusi), Palm oil, Stockfish, Shaki, Beef, Spinach, Ground crayfish',
    originStory: 'This recipe is a tribute to the royal courts of Old Ife. The Egusi is slow-toasted to release its natural nuttiness, a technique passed down through generations of palace cooks.',
  },
  {
    name: 'Gourmet Beef Suya',
    description: 'Thinly sliced beef marinated in spicy Yaji peanut spice, flame-grilled to perfection. Served with red onions and tomatoes.',
    price: 14.00,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'Beef flank, Groundnut cake (Kuli-kuli), Ginger powder, Onion powder, Cayenne pepper, Peanut oil',
    isSpicy: true,
    originStory: 'A North-meets-South fusion. We source our Yaji spice directly from a small artisan group in Kano, ensuring the authentic punch of real Kuli-kuli.',
  },
  {
    name: 'Seafood Okra Supreme',
    description: 'Freshly chopped okra cooked with giant prawns, calamari, and fresh fish in a savory seafood broth.',
    price: 25.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1559742811-822873691fc8?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'Okra, Jumbo Prawns, Calamari, Snapper fish, Palm oil, Locust beans (Iru), Periwinkles',
    originStory: 'Born on the shores of Epe, this dish celebrates the daily bounty of the Atlantic. Our broth is clarified over 6 hours to ensure a velvet finish.',
  },

  // --- Foreign Favorites ---
  {
    name: 'Black Truffle Wagyu Burger',
    description: 'A5 Wagyu beef patty, double-aged swiss cheese, caramelized onion jam, and a thick layer of black truffle aioli on a toasted brioche.',
    price: 32.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'A5 Wagyu Beef, Brioche bun, Black truffle, Swiss cheese, Balsamic onions, Roasted garlic aioli',
    originStory: 'Chef\'s signature "Global Fusion" masterpiece. By combining Japan\'s finest A5 Wagyu with Perigord truffles, we created the ultimate luxury comfort food.',
  },
  {
    name: 'Lobster Thermidor Pasta',
    description: 'Butter-poached lobster chunks tossed in a creamy cognac-infused sauce with fresh linguine and parmesan reggiano.',
    price: 38.00,
    category: 'Mains',
    image: '/slider/slide_4_lobster_1777427881007.png',
    ingredients: 'Fresh Lobster, Linguine, Cognac, Heavy cream, Gruyère cheese, Mustard powder, Parsley',
    originStory: 'A modern take on the 1894 Parisian classic. We add a touch of local Nigerian alligator pepper to provide a subtle, floral heat that elevates the cognac cream.',
  },
  {
    name: 'Golden Miso Salmon',
    description: 'Atlantic salmon marinated in white miso and honey, pan-seared and served with ginger-infused bok choy.',
    price: 28.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'Wild Salmon, White Miso, Honey, Sake, Ginger, Bok Choy, Sesame seeds',
    originStory: 'The result of our Chef\'s residency in Kyoto. The glaze uses a 12-month fermented miso that brings an unmatched depth of umami to the Atlantic salmon.',
  },
  {
    name: 'Molten Gold Lava Cake',
    description: 'Decadent 70% dark chocolate fondant with a liquid gold caramel center, served with Madagascan vanilla bean gelato.',
    price: 15.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'Dark Chocolate, Salted Caramel, Cocoa powder, Eggs, Madagascan Vanilla, Sea salt',
    originStory: 'Our tribute to the gold-rich history of West Africa. The liquid center is infused with edible gold dust for a truly royal dessert experience.',
  },

  // --- New Nigerian Local ---
  {
    name: 'Edikaikong Royalty',
    description: 'A rich vegetable soup from the Efik people, loaded with pumpkin leaves, waterleaf, and a treasure of seafood and premium meats.',
    price: 24.00,
    category: 'Mains',
    image: '/slider/slide_6_edikaikong_1777428079255.png',
    ingredients: 'Pumpkin leaves (Ugu), Waterleaf, Periwinkles, Smoked fish, Goat meat, Palm oil, Crayfish',
    originStory: 'Known as the "Soup of Kings" in Calabar. We use only fresh waterleaf harvested at dawn to preserve the vibrant green color and nutrient density.',
  },
  {
    name: 'The Abula Experience',
    description: 'The classic Amala, Gbegiri (bean soup), and Ewedu trio. A soulful Yoruba delicacy served with goat meat and spicy tomato stew.',
    price: 19.50,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'Yam flour (Amala), Brown beans (Gbegiri), Jute leaves (Ewedu), Locust beans, Palm oil, Assorted meat',
    originStory: 'Inspired by the legendary "Iya Meta" food culture. Our Amala is sun-dried for extra depth, and the Ewedu is hand-whisked to ensure the perfect silkiness.',
  },

  // --- New Foreign Favorites ---
  {
    name: 'Dry-Aged Ribeye',
    description: '45-day dry-aged Prime Ribeye, bone-in, grilled over white oak and finished with smoked bone marrow butter.',
    price: 45.00,
    category: 'Mains',
    image: '/slider/slide_5_ribeye_1777427992365.png',
    ingredients: '45-Day Dry-Aged Beef, Bone marrow, Rosemary, Sea salt, Black pepper, Garlic',
    originStory: 'The pinnacle of our steak program. We dry-age in-house using Himalayan salt blocks to concentrate flavors and create a melt-in-your-mouth texture.',
  },
  {
    name: 'Valencia Seafood Paella',
    description: 'Saffron-infused Bomba rice cooked in a traditional wide pan with tiger prawns, mussels, and Spanish chorizo.',
    price: 34.00,
    category: 'Mains',
    image: '/slider/slide_4_lobster_1777427881007.png',
    ingredients: 'Bomba Rice, Saffron, Tiger Prawns, Mussels, Chorizo, Bell peppers, Fish stock',
    originStory: 'A celebration of the Mediterranean sun. Our Saffron is sourced from the La Mancha region, providing that iconic golden hue and earthy aroma.',
  },
  {
    name: 'French Duck Confit',
    description: 'Slow-cooked duck leg in its own fat until fork-tender, with a perfectly crispy skin. Served over a bed of puy lentils.',
    price: 32.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1514516348920-f5d90e8e738d?auto=format&fit=crop&q=80&w=1000',
    ingredients: 'Duck leg, Duck fat, Thyme, Puy lentils, Mirepoix, Red wine reduction',
    originStory: 'A masterclass in patience. Each leg is cured for 24 hours before a 12-hour slow bath in pure duck fat, a technique perfected in Gascony.',
  },
];

const LOCATIONS = [
  {
    name: 'FeastOS - Victoria Island',
    address: '12 Adetokunbo Ademola St',
    city: 'Lagos',
    phone: '+234 801 234 5678',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000',
    lat: 6.4311,
    lng: 3.4258,
  },
  {
    name: 'FeastOS - Lagos Mainland',
    address: '45 Isaac John St, Ikeja GRA',
    city: 'Lagos',
    phone: '+234 802 345 6789',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000',
    lat: 6.5898,
    lng: 3.3512,
  }
];

async function main() {
  console.log('Cleaning up database...');
  await prisma.menuItem.deleteMany();
  await prisma.location.deleteMany();
  
  console.log('Seeding locations...');
  for (const loc of LOCATIONS) {
    await prisma.location.create({ data: loc });
  }

  console.log('Seeding stunning menu items...');
  for (const item of STUNNING_MENU) {
    await prisma.menuItem.create({
      data: item,
    });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
