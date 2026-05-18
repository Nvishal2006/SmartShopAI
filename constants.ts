import { Product } from './types';

// Helper to get fast, reliable images from Unsplash
const getUnsplashImage = (keywords: string) => 
  `https://source.unsplash.com/800x800/?${encodeURIComponent(keywords)}`;

// Fallback to specific high-quality images since source.unsplash can be unpredictable with redirects
const IMAGES = {
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
  chair: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
  speaker: 'https://images.unsplash.com/photo-1589440163303-54cdf71f68f4?auto=format&fit=crop&w=800&q=80',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  keyboard: 'https://images.unsplash.com/photo-1587829745563-1c789ee31c83?auto=format&fit=crop&w=800&q=80',
  tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
  lamp: 'https://images.unsplash.com/photo-1507473888900-52e1ad819bb2?auto=format&fit=crop&w=800&q=80',
  thermostat: 'https://images.unsplash.com/photo-1585128993786-9996441996b5?auto=format&fit=crop&w=800&q=80',
  mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80',
  sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  vacuum: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80',
  ssd: 'https://images.unsplash.com/photo-1597872252739-781f29d791b5?auto=format&fit=crop&w=800&q=80',
  filmCam: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  desk: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
  doorbell: 'https://images.unsplash.com/photo-1558002038-1091a166111c?auto=format&fit=crop&w=800&q=80'
};

// Generic GLB models for AR demo
const MODELS = {
  chair: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
  mixer: 'https://modelviewer.dev/shared-assets/models/Mixer.glb', // close enough to small appliances
  astronaut: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // fallback
  shoes: 'https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'QuantumX Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life and immersive audio.',
    price: 299.99,
    category: 'Electronics',
    rating: 4.8,
    reviews: 1204,
    imageUrl: IMAGES.headphones,
    tags: ['audio', 'wireless', 'bluetooth', 'premium'],
    isNew: true,
    pros: ['Exceptional noise cancellation', '30-hour battery life', 'Comfortable ear cups'],
    cons: ['High price point', 'Bulky carrying case']
  },
  {
    id: 'p2',
    name: 'UltraBook Pro 15"',
    description: 'Lightweight laptop with M3 chip, 16GB RAM, and 512GB SSD. Perfect for creatives.',
    price: 1299.00,
    category: 'Computers',
    rating: 4.9,
    reviews: 850,
    imageUrl: IMAGES.laptop,
    tags: ['laptop', 'work', 'fast', 'computer'],
    pros: ['Blazing fast M3 chip', 'Stunning retina display', 'All-day battery'],
    cons: ['Limited port selection', 'Soldered RAM']
  },
  {
    id: 'p3',
    name: 'ErgoFlex Mesh Chair',
    description: 'Ergonomic office chair with lumbar support and breathable mesh back.',
    price: 199.50,
    category: 'Furniture',
    rating: 4.5,
    reviews: 340,
    imageUrl: IMAGES.chair,
    tags: ['office', 'comfort', 'chair'],
    pros: ['Great lumbar support', 'Breathable mesh', 'Adjustable armrests'],
    cons: ['Assembly required', 'Headrest sold separately'],
    arModelUrl: MODELS.chair
  },
  {
    id: 'p4',
    name: 'SmartHome Hub Mini',
    description: 'Control your lights, locks, and thermostat with your voice. Compact design.',
    price: 49.99,
    category: 'Smart Home',
    rating: 4.3,
    reviews: 2100,
    imageUrl: IMAGES.speaker,
    tags: ['smart home', 'assistant', 'tech'],
    discount: 10,
    pros: ['Compact size', 'Affordable', 'Compatible with many devices'],
    cons: ['Speaker quality average', 'Requires constant power'],
    arModelUrl: MODELS.mixer
  },
  {
    id: 'p5',
    name: '4K Action Camera',
    description: 'Waterproof up to 50m, 4K 60fps recording, includes mounting kit.',
    price: 249.00,
    category: 'Cameras',
    rating: 4.6,
    reviews: 500,
    imageUrl: IMAGES.camera,
    tags: ['camera', 'video', 'sport', 'outdoor'],
    pros: ['4K 60fps video', 'Waterproof without case', 'Good stabilization'],
    cons: ['Short battery life in 4K', 'Small touchscreen']
  },
  {
    id: 'p6',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit, cherry MX switches, durable aluminum frame.',
    price: 129.99,
    category: 'Electronics',
    rating: 4.7,
    reviews: 920,
    imageUrl: IMAGES.keyboard,
    tags: ['gaming', 'keyboard', 'rgb'],
    discount: 15,
    pros: ['Tactile switches', 'Customizable RGB', 'Durable build'],
    cons: ['Loud typing sound', 'Heavy cable']
  },
  {
    id: 'p7',
    name: 'OLED 65" Smart TV',
    description: 'Cinematic experience with absolute blacks and vibrant colors.',
    price: 1899.00,
    category: 'Electronics',
    rating: 4.8,
    reviews: 450,
    imageUrl: IMAGES.tv,
    tags: ['tv', 'screen', 'cinema'],
    pros: ['Perfect blacks', 'Ultra-thin design', 'Great gaming features'],
    cons: ['Risk of burn-in', 'Expensive']
  },
  {
    id: 'p8',
    name: 'Pro DSLR Camera Kit',
    description: '24MP sensor, includes 18-55mm lens and carrying bag.',
    price: 899.00,
    category: 'Cameras',
    rating: 4.9,
    reviews: 120,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    tags: ['photography', 'camera', 'professional'],
    pros: ['Excellent image quality', 'Versatile lens included', 'Long battery life'],
    cons: ['Heavy and bulky', 'Steep learning curve']
  },
  {
    id: 'p9',
    name: 'Minimalist Desk Lamp',
    description: 'Adjustable color temperature, wireless charging base.',
    price: 45.00,
    category: 'Furniture',
    rating: 4.2,
    reviews: 89,
    imageUrl: IMAGES.lamp,
    tags: ['lighting', 'office', 'decor'],
    pros: ['Wireless charging base', 'Sleek design', 'Eye-friendly light'],
    cons: ['Not very bright', 'Proprietary power adapter']
  },
  {
    id: 'p10',
    name: 'Smart WiFi Thermostat',
    description: 'Save energy with intelligent scheduling and remote control.',
    price: 129.00,
    category: 'Smart Home',
    rating: 4.6,
    reviews: 1500,
    imageUrl: IMAGES.thermostat,
    tags: ['energy', 'smart home', 'climate'],
    pros: ['Energy saving', 'Remote app control', 'Modern look'],
    cons: ['C-wire required', 'Complex installation']
  },
  {
    id: 'p11',
    name: 'Gaming Mouse Wireless',
    description: 'Ultra-lightweight, 20k DPI sensor, 70hr battery.',
    price: 89.99,
    category: 'Computers',
    rating: 4.7,
    reviews: 600,
    imageUrl: IMAGES.mouse,
    tags: ['gaming', 'mouse', 'computer'],
    isNew: true,
    pros: ['Extremely lightweight', 'Lag-free wireless', 'Long battery'],
    cons: ['Small side buttons', 'Pricey']
  },
  {
    id: 'p12',
    name: 'Modern Sofa Grey',
    description: 'Mid-century modern style, stain-resistant fabric.',
    price: 899.00,
    category: 'Furniture',
    rating: 4.4,
    reviews: 210,
    imageUrl: IMAGES.sofa,
    tags: ['living room', 'sofa', 'furniture'],
    pros: ['Stylish design', 'Stain-resistant', 'Easy assembly'],
    cons: ['Firm cushions', 'Low backrest'],
    arModelUrl: MODELS.chair
  },
  {
    id: 'p13',
    name: 'Robot Vacuum Cleaner',
    description: 'Lidar navigation, self-emptying base, pet hair specialist.',
    price: 549.00,
    category: 'Smart Home',
    rating: 4.5,
    reviews: 890,
    imageUrl: IMAGES.vacuum,
    tags: ['cleaning', 'robot', 'smart home'],
    discount: 20,
    pros: ['Self-emptying', 'Smart mapping', 'Great for pet hair'],
    cons: ['Noisy base', 'Gets stuck on cords']
  },
  {
    id: 'p14',
    name: 'External SSD 2TB',
    description: 'Rugged portable drive, 1050MB/s read speeds.',
    price: 159.99,
    category: 'Computers',
    rating: 4.8,
    reviews: 3400,
    imageUrl: IMAGES.ssd,
    tags: ['storage', 'memory', 'computer'],
    pros: ['Very fast speeds', 'Drop resistant', 'Compact'],
    cons: ['Short included cable', 'Runs warm']
  },
  {
    id: 'p15',
    name: 'Vintage Film Camera',
    description: 'Restored classic 35mm film camera. Body only.',
    price: 399.00,
    category: 'Cameras',
    rating: 4.9,
    reviews: 45,
    imageUrl: IMAGES.filmCam,
    tags: ['retro', 'photography', 'art'],
    pros: ['Authentic film look', 'Collectible item', 'Tactile feel'],
    cons: ['Manual focus only', 'Film is expensive']
  },
  {
    id: 'p16',
    name: 'Standing Desk Motorized',
    description: 'Dual motor, memory presets, bamboo top.',
    price: 450.00,
    category: 'Furniture',
    rating: 4.8,
    reviews: 560,
    imageUrl: IMAGES.desk,
    tags: ['office', 'health', 'desk'],
    isNew: true,
    pros: ['Smooth dual motors', 'Beautiful bamboo top', 'Memory settings'],
    cons: ['Heavy packaging', 'Cable management tricky']
  },
  {
    id: 'p17',
    name: 'Smart Doorbell Video',
    description: '1080p HD video, two-way talk, motion detection.',
    price: 99.99,
    category: 'Smart Home',
    rating: 4.4,
    reviews: 3200,
    imageUrl: IMAGES.doorbell,
    tags: ['security', 'smart home', 'camera'],
    pros: ['Clear HD video', 'Instant notifications', 'Two-way audio'],
    cons: ['Subscription for recording', 'WiFi strength dependent']
  }
];

export const CATALOG_CONTEXT = `
You are ShopBot, the official AI assistant for SmartShopAi.
Here is our current product catalog JSON. You MUST use this data to answer questions.
Do not invent products. If a user asks for a product not in this list, suggest the closest alternative from this list or say we don't have it.

CATALOG:
${JSON.stringify(MOCK_PRODUCTS, null, 2)}

BEHAVIOR:
- Be helpful, enthusiastic, and concise.
- If the user provides an image, analyze it to find matching products in the catalog.
- If the user asks for recommendations, analyze their needs against the tags and description.
- If the user is looking for an out-of-stock item, apologize and offer to notify management to restock it within 3 days.
`;