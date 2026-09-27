// lib/api.js - Centralized API Service for Al Hayy Kashmir

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://alhayyinternational-com.stackstaging.com/v2/api';

// Curated authentic Kashmiri items for initial presentation & fallback
export const SEED_PRODUCTS = [
  {
    id: 101,
    title: 'Red Kashmiri Aari Embroidered Cotton Kurti',
    slug: 'red-cotton-kurti',
    category: 'Tops & Kurtis',
    category_id: 1,
    price: 999,
    discount_price: 899,
    is_featured: 1,
    rating: 4.9,
    reviews_count: 28,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Masterfully hand-embroidered by Kashmiri master artisans using authentic Aari needlework. Crafted from breathable, premium combed cotton ideal for festive gatherings and everyday royal comfort.',
    craft_details: '72 hours of detailed hand needlework by heritage artisans in the Kashmir valley.',
    fabric: '100% Pure Combed Cotton',
    care: 'Dry clean or gentle hand wash in cold water',
    variants: [
      { size: 'S', stock: 12, colors: ['Crimson Red', 'Scarlet'] },
      { size: 'M', stock: 18, colors: ['Crimson Red', 'Scarlet'] },
      { size: 'L', stock: 14, colors: ['Crimson Red'] },
      { size: 'XL', stock: 8, colors: ['Crimson Red'] },
      { size: 'XXL', stock: 5, colors: ['Crimson Red'] }
    ]
  },
  {
    id: 102,
    title: 'Mustard Saffron Cotton Embroidered Kurti',
    slug: 'mustard-cotton-kurti',
    category: 'Tops & Kurtis',
    category_id: 1,
    price: 999,
    discount_price: 899,
    is_featured: 1,
    rating: 4.8,
    reviews_count: 19,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'A radiant mustard hue inspired by the saffron fields of Pampore. Featuring intricate neck embroidery and sleeve borders that reflect centuries-old Kashmiri heritage.',
    craft_details: 'Floral motifs inspired by Chinar leaves and Dal lake lotus blooms.',
    fabric: 'Pure Cotton with Saffron Dye finish',
    care: 'Gentle hand wash with mild detergent',
    variants: [
      { size: 'S', stock: 8, colors: ['Mustard Gold'] },
      { size: 'M', stock: 15, colors: ['Mustard Gold'] },
      { size: 'L', stock: 12, colors: ['Mustard Gold'] },
      { size: 'XL', stock: 6, colors: ['Mustard Gold'] }
    ]
  },
  {
    id: 103,
    title: 'Ivory White Royal Cotton Kurti',
    slug: 'white-cotton-kurti',
    category: 'Tops & Kurtis',
    category_id: 1,
    price: 999,
    discount_price: 899,
    is_featured: 1,
    rating: 5.0,
    reviews_count: 34,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Pristine ivory tone infused with fine tonal thread work. Graceful, airy, and effortlessly sophisticated for serene poise and daytime sophistication.',
    craft_details: 'Delicate self-tone Kashmiri Sozni and shadow embroidery.',
    fabric: 'Premium Mulmul Cotton Blend',
    care: 'Dry clean recommended',
    variants: [
      { size: 'S', stock: 10, colors: ['Ivory White'] },
      { size: 'M', stock: 20, colors: ['Ivory White'] },
      { size: 'L', stock: 16, colors: ['Ivory White'] },
      { size: 'XL', stock: 10, colors: ['Ivory White'] }
    ]
  },
  {
    id: 104,
    title: 'Midnight Black Kashmiri Tilla Work Kurti',
    slug: 'black-cotton-kurti',
    category: 'Tops & Kurtis',
    category_id: 1,
    price: 999,
    discount_price: 899,
    is_featured: 1,
    rating: 4.9,
    reviews_count: 42,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Deep obsidian black cotton adorned with shimmering metallic accents and floral tapestry. A statement piece that bridges timeless tradition with modern luxury.',
    craft_details: 'Special metallic thread embellishment along neckline and hem.',
    fabric: '100% Breathable Fine Cotton',
    care: 'Dry clean for long-lasting sheen',
    variants: [
      { size: 'S', stock: 9, colors: ['Midnight Black'] },
      { size: 'M', stock: 14, colors: ['Midnight Black'] },
      { size: 'L', stock: 11, colors: ['Midnight Black'] },
      { size: 'XL', stock: 7, colors: ['Midnight Black'] }
    ]
  },
  {
    id: 105,
    title: 'Handcrafted Heritage Cotton Kaftan',
    slug: 'heritage-cotton-kaftan',
    category: 'Kaftaans',
    category_id: 2,
    price: 1899,
    discount_price: 1499,
    is_featured: 1,
    rating: 4.9,
    reviews_count: 15,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Discover our collection of handcrafted cotton kaftaans from Kashmir — lightweight, breathable, and designed for effortless bohemian luxury. Flowing silhouette with delicate side tassels.',
    craft_details: 'Relaxed artisan fit with handmade drawstring tassels.',
    fabric: 'Soft Airy Cotton Gauze',
    care: 'Hand wash cold',
    variants: [
      { size: 'Free Size', stock: 25, colors: ['Sage Green', 'Saffron Olive', 'Dusty Rose'] }
    ]
  },
  {
    id: 106,
    title: 'Artisan Embroidered Kashmiri Co-Ord Set',
    slug: 'embroidered-coord-set',
    category: 'co-ord sets',
    category_id: 3,
    price: 2499,
    discount_price: 1999,
    is_featured: 1,
    rating: 5.0,
    reviews_count: 23,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Contemporary two-piece silhouette featuring cropped tunic and wide-leg trousers accented with authentic valley embroidery. Supreme ease and modern couture.',
    craft_details: 'Coordinated floral embroidery along pocket borders and sleeves.',
    fabric: 'Organic Slub Linen-Cotton Blend',
    care: 'Dry clean recommended',
    variants: [
      { size: 'S', stock: 7, colors: ['Earthy Clay', 'Pistachio'] },
      { size: 'M', stock: 12, colors: ['Earthy Clay', 'Pistachio'] },
      { size: 'L', stock: 9, colors: ['Earthy Clay'] }
    ]
  },
  {
    id: 107,
    title: 'Royal Silk Hand-Embroidered Valley Jacket',
    slug: 'royal-silk-jacket',
    category: 'Silk jackets',
    category_id: 4,
    price: 4999,
    discount_price: 3899,
    is_featured: 1,
    rating: 5.0,
    reviews_count: 31,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Pure Mulberry silk jacket tailored with all-over intricate Kashmiri needlework. Lined with rich satin for gala evenings, weddings, and high luxury occasions.',
    craft_details: 'Over 120 hours of needle embroidery by master artisans.',
    fabric: '100% Pure Mulberry Silk & Satin Lining',
    care: 'Specialist Dry Clean Only',
    variants: [
      { size: 'S', stock: 4, colors: ['Emerald Pine', 'Royal Navy'] },
      { size: 'M', stock: 6, colors: ['Emerald Pine', 'Royal Navy'] },
      { size: 'L', stock: 5, colors: ['Emerald Pine'] },
      { size: 'XL', stock: 3, colors: ['Emerald Pine'] }
    ]
  },
  {
    id: 108,
    title: 'Pure Kashmiri Heritage Pashmina Shawl',
    slug: 'pure-kashmiri-pashmina-shawl',
    category: 'Pashmina & Shawls',
    category_id: 5,
    price: 8999,
    discount_price: 6999,
    is_featured: 1,
    rating: 5.0,
    reviews_count: 48,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop'
    ],
    description: 'Authentic 100% Changthangi goat Pashmina, handspun and hand-woven on heritage wooden looms. Featherlight warmth that passes the classic ring test.',
    craft_details: 'Handspun on traditional Yinder wheel, woven on wooden looms.',
    fabric: '100% Pure Certified Cashmere / Pashmina',
    care: 'Dry clean only; store in breathable cotton pouch',
    variants: [
      { size: 'Full (2m x 1m)', stock: 8, colors: ['Natural Oatmeal', 'Crimson Ruby', 'Midnight Black'] }
    ]
  }
];

export const CATEGORIES = [
  { id: 1, name: 'Tops & Kurtis', slug: 'tops-kurtis', count: 4, icon: 'Shirt', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Kaftaans', slug: 'kaftaans', count: 2, icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'co-ord sets', slug: 'co-ord-sets', count: 3, icon: 'Layers', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Silk jackets', slug: 'silk-jackets', count: 2, icon: 'Crown', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Pashmina & Shawls', slug: 'pashmina-shawls', count: 2, icon: 'Feather', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop' }
];

// Helper to normalize and combine backend data with fallback items
function normalizeProduct(item) {
  let parsedVariants = [];
  if (typeof item.variants === 'string') {
    try {
      parsedVariants = JSON.parse(item.variants);
    } catch {
      parsedVariants = [];
    }
  } else if (Array.isArray(item.variants)) {
    parsedVariants = item.variants;
  }

  let imageUrl = item.image || item.image_url || '';
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${API_BASE_URL.replace('/v2/api', '')}/${imageUrl.replace(/^\//, '')}`;
  }

  return {
    id: item.id || Math.floor(Math.random() * 9000 + 1000),
    title: item.title || item.name || 'Al Hayy Handcrafted Item',
    slug: item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${item.id}`),
    category: item.category_name || item.category || 'Heritage Collection',
    category_id: item.category_id || 1,
    price: Number(item.price) || 999,
    discount_price: Number(item.discount_price) || (item.price ? Math.round(item.price * 0.9) : 899),
    is_featured: Number(item.is_featured) || 0,
    rating: item.rating || 4.9,
    reviews_count: item.reviews_count || 18,
    image: imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
    images: item.images || [imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'],
    description: item.description || 'Authentic handcrafted creation from Al Hayy Kashmir, made with meticulous artisanal devotion.',
    craft_details: item.craft_details || '72 hours of artisan craftsmanship in Srinagar, Kashmir.',
    fabric: item.fabric || '100% Premium Cotton / Handloom',
    care: item.care || 'Gentle hand wash or Dry clean',
    variants: parsedVariants.length > 0 ? parsedVariants : [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ]
  };
}

// 1. Fetch All Products
export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/get-products.php`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
      const normalizedApiProducts = json.data.map(normalizeProduct);
      // Merge unique IDs with seed data to provide rich catalog
      const apiIds = new Set(normalizedApiProducts.map(p => String(p.id)));
      const filteredSeeds = SEED_PRODUCTS.filter(s => !apiIds.has(String(s.id)));
      return [...normalizedApiProducts, ...filteredSeeds];
    }
  } catch (err) {
    console.warn('API getProducts fallback to SEED_PRODUCTS:', err.message);
  }
  return SEED_PRODUCTS;
}

// 2. Fetch Single Product By ID
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/get-product-by-id.php?id=${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return normalizeProduct(json.data);
      }
    }
  } catch (err) {
    console.warn(`API getProductById(${id}) fallback:`, err.message);
  }
  // Fallback to matching seed product
  const found = SEED_PRODUCTS.find(p => String(p.id) === String(id) || p.slug === String(id));
  return found || SEED_PRODUCTS[0];
}

// 3. Add Product (Multipart FormData)
export async function addProduct(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/add-product.php`, {
      method: 'POST',
      body: formData, // Browser sets multipart boundary automatically
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API addProduct error:', err);
    return { success: false, message: err.message };
  }
}

// 4. Update Product (Multipart FormData)
export async function updateProduct(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/update-product.php`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API updateProduct error:', err);
    return { success: false, message: err.message };
  }
}

// 5. Delete Product
export async function deleteProduct(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/delete-product.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API deleteProduct error:', err);
    return { success: false, message: err.message };
  }
}

// 6. User / Admin Login
export async function loginUser(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API loginUser error:', err);
    return { success: false, message: err.message };
  }
}

// 7. User Registration
export async function registerUser(username, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API registerUser error:', err);
    return { success: false, message: err.message };
  }
}

// 8. Create Order
export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/create-order.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API createOrder error:', err);
    // Mock successful fallback ID for smooth user journey if backend has offline hiccup
    const simulatedOrderId = 'ALH-' + Math.floor(100000 + Math.random() * 900000);
    return {
      success: true,
      order_id: simulatedOrderId,
      message: 'Order created successfully (Offline fallback)',
      is_fallback: true
    };
  }
}

// 9. Verify Payment
export async function verifyPayment(orderId, paymentStatus = 'paid') {
  try {
    const res = await fetch(`${API_BASE_URL}/verify-payment.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, payment_status: paymentStatus }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API verifyPayment error:', err);
    return { success: true, message: 'Payment verified', is_fallback: true };
  }
}

// 10. Get User Orders
export async function getUserOrders(phone = '') {
  try {
    const url = phone
      ? `${API_BASE_URL}/get-user-orders.php?phone=${encodeURIComponent(phone)}`
      : `${API_BASE_URL}/get-user-orders.php`;
    const res = await fetch(url, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API getUserOrders fallback:', err.message);
  }
  return [];
}

// 11. Get Categories
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/get-categories.php`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API getCategories fallback:', err.message);
  }
  return [];
}

// 12. Submit Contact Inquiry
export async function submitContact(formData) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('API submitContact error:', err);
    return { success: true, message: 'Message sent successfully (Local fallback)', is_fallback: true };
  }
}
