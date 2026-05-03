// Curated mystery-box pools per category. The reveal modal picks one at random.

export const MYSTERY_CATEGORIES = [
  {
    id: 'drinks',
    label: 'Drinks',
    icon: 'CupSoda',
    sub: 'Coffee · juices · smoothies',
    tint: 'from-sky-400 to-blue-600',
    chip: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
  },
  {
    id: 'sweets',
    label: 'Sweets',
    icon: 'Cake',
    sub: 'Pastries · desserts · chocolate',
    tint: 'from-pink-400 to-rose-600',
    chip: 'bg-pink-500/15 text-pink-500 border-pink-500/30',
  },
  {
    id: 'salty',
    label: 'Salty',
    icon: 'Sandwich',
    sub: 'Sandwiches · cheese · snacks',
    tint: 'from-amber-400 to-orange-600',
    chip: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  },
  {
    id: 'spicy',
    label: 'Spicy',
    icon: 'Flame',
    sub: 'Bold flavours · with a kick',
    tint: 'from-red-500 to-rose-700',
    chip: 'bg-red-500/15 text-red-500 border-red-500/30',
  },
  {
    id: 'healthy',
    label: 'Healthy',
    icon: 'Salad',
    sub: 'Salads · grain bowls · fruit',
    tint: 'from-emerald-400 to-teal-600',
    chip: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  },
  {
    id: 'surprise',
    label: 'Surprise Me',
    icon: 'Dices',
    sub: 'Total wildcard — across all',
    tint: 'from-violet-500 to-fuchsia-600',
    chip: 'bg-violet-500/15 text-violet-500 border-violet-500/30',
  },
];

const MAKE = (
  vendor,
  title,
  emoji,
  description,
  originalPrice,
  discountedPrice,
  image
) => ({ vendor, title, emoji, description, originalPrice, discountedPrice, image });

const POOLS_BY_CATEGORY = {
  drinks: [
    MAKE(
      'Flat White Doha',
      'Specialty Coffee Trio',
      '☕',
      'Three signature single-origin pours: Ethiopian Yirgacheffe, Kenyan AA, and a house decaf.',
      55, 18,
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Press Lab',
      'Cold-Pressed Juice 4-pack',
      '🥤',
      'Beet-ginger, green detox, citrus immunity, and watermelon-mint.',
      80, 25,
      'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Smooth Co.',
      'Smoothie Bowl Bundle',
      '🥭',
      'Mango-passionfruit and acai-berry bowls with house-made granola.',
      70, 22,
      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=900&auto=format&fit=crop'
    ),
  ],
  sweets: [
    MAKE(
      'Paul Bakery',
      'French Pastry Box',
      '🥐',
      'Buttery croissants, pain au chocolat, and a kouign-amann from this morning\'s bake.',
      60, 20,
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Al Aker Sweets',
      'Baklava Selection',
      '🍯',
      'Pistachio, walnut and cashew baklava — handmade with Damascus rosewater syrup.',
      75, 25,
      'https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Sucré Lusail',
      'Macaron Box of 12',
      '🍬',
      'Pistachio, raspberry, salted caramel, vanilla — twelve perfect bites.',
      90, 30,
      'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=900&auto=format&fit=crop'
    ),
  ],
  salty: [
    MAKE(
      'The Cheese Bar',
      'Mediterranean Cheese Board',
      '🧀',
      'Halloumi, manchego, brie and labneh with olives, dates, and crispbread.',
      120, 38,
      'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Mama\'s Manakeesh',
      'Manakeesh Trio',
      '🫓',
      'Za\'atar, cheese, and meat manakeesh fresh off the saj.',
      45, 15,
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Doha Deli',
      'Gourmet Sandwich Pack',
      '🥪',
      'Three artisan sandwiches: pastrami rye, smoked salmon bagel, and roasted veg ciabatta.',
      65, 22,
      'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=900&auto=format&fit=crop'
    ),
  ],
  spicy: [
    MAKE(
      'Saffron House',
      'Indian Tandoor Sampler',
      '🌶️',
      'Chicken tikka, lamb seekh kebab, paneer tikka — straight from the clay oven.',
      85, 28,
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Beirut Express',
      'Spicy Mezze Trio',
      '🔥',
      'Muhammara, harissa-spiked hummus, and shatta-glazed grilled wings.',
      70, 22,
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Bangkok Soi',
      'Thai Heat Bundle',
      '🌶️',
      'Pad krapow, tom yum soup, and som tam — Thailand\'s greatest hits, with chilli.',
      80, 26,
      'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=900&auto=format&fit=crop'
    ),
  ],
  healthy: [
    MAKE(
      'Greens & Co.',
      'Power Bowl Duo',
      '🥗',
      'Two grain bowls: quinoa-tabbouleh and freekeh-falafel with tahini.',
      75, 24,
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Fruit Forest',
      'Tropical Fruit Box',
      '🍓',
      'Dragonfruit, mango, papaya, fresh berries — pre-cut and ready to eat.',
      90, 28,
      'https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?w=900&auto=format&fit=crop'
    ),
    MAKE(
      'Cleanse Doha',
      'Wellness Day Box',
      '🌿',
      'Two cold-pressed juices, a chia pudding, and an overnight oats jar.',
      85, 28,
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&auto=format&fit=crop'
    ),
  ],
};

// "Surprise Me" = union of every other category.
const ALL_ITEMS = Object.values(POOLS_BY_CATEGORY).flat();

export function pickMysteryItem(categoryId) {
  const pool = categoryId === 'surprise' ? ALL_ITEMS : POOLS_BY_CATEGORY[categoryId] || ALL_ITEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}
