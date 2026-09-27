// seed-live-db.js
const API_BASE_URL = 'http://alhayyinternational-com.stackstaging.com/v2/api';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Origin': 'http://alhayyinternational-com.stackstaging.com',
  'Referer': 'http://alhayyinternational-com.stackstaging.com/',
  'Accept': 'application/json, text/plain, */*'
};

const productsToSeed = [
  {
    title: 'Red Kashmiri Aari Embroidered Cotton Kurti',
    description: 'Masterfully hand-embroidered by Kashmiri master artisans using authentic Aari needlework. Crafted from breathable, premium combed cotton ideal for festive gatherings and everyday royal comfort.',
    price: 999,
    discount_price: 899,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 14 },
      { size: 'XL', stock: 8 }
    ]
  },
  {
    title: 'Mustard Saffron Cotton Embroidered Kurti',
    description: 'A radiant mustard hue inspired by the saffron fields of Pampore. Featuring intricate neck embroidery and sleeve borders that reflect centuries-old Kashmiri heritage.',
    price: 999,
    discount_price: 899,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 }
    ]
  },
  {
    title: 'Ivory White Royal Cotton Kurti',
    description: 'Pristine ivory tone infused with fine tonal thread work. Graceful, airy, and effortlessly sophisticated for serene poise and daytime sophistication.',
    price: 999,
    discount_price: 899,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 16 }
    ]
  },
  {
    title: 'Midnight Black Kashmiri Tilla Work Kurti',
    description: 'Deep obsidian black cotton adorned with shimmering metallic accents and floral tapestry. A statement piece that bridges timeless tradition with modern luxury.',
    price: 999,
    discount_price: 899,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'S', stock: 9 },
      { size: 'M', stock: 14 },
      { size: 'L', stock: 11 }
    ]
  },
  {
    title: 'Handcrafted Heritage Cotton Kaftan',
    description: 'Discover our collection of handcrafted cotton kaftaans from Kashmir — lightweight, breathable, and designed for effortless bohemian luxury. Flowing silhouette with delicate side tassels.',
    price: 1899,
    discount_price: 1499,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'Free Size', stock: 25 }
    ]
  },
  {
    title: 'Artisan Embroidered Kashmiri Co-Ord Set',
    description: 'Contemporary two-piece silhouette featuring cropped tunic and wide-leg trousers accented with authentic valley embroidery. Supreme ease and modern couture.',
    price: 2499,
    discount_price: 1999,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'S', stock: 7 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 9 }
    ]
  },
  {
    title: 'Royal Silk Hand-Embroidered Valley Jacket',
    description: 'Pure Mulberry silk jacket tailored with all-over intricate Kashmiri needlework. Lined with rich satin for gala evenings, weddings, and high luxury occasions.',
    price: 4999,
    discount_price: 3899,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'S', stock: 4 },
      { size: 'M', stock: 6 },
      { size: 'L', stock: 5 }
    ]
  },
  {
    title: 'Pure Kashmiri Heritage Pashmina Shawl',
    description: 'Authentic 100% Changthangi goat Pashmina, handspun and hand-woven on heritage wooden looms. Featherlight warmth that passes the classic ring test.',
    price: 8999,
    discount_price: 6999,
    is_featured: 1,
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=900&auto=format&fit=crop',
    variants: [
      { size: 'Full (2m x 1m)', stock: 8 }
    ]
  }
];

async function seedLiveDatabase() {
  console.log('--- Uploading Products directly to Live MySQL Database ---');

  for (const item of productsToSeed) {
    try {
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('description', item.description);
      formData.append('price', String(item.price));
      formData.append('discount_price', String(item.discount_price));
      formData.append('is_featured', String(item.is_featured));
      formData.append('variants', JSON.stringify(item.variants));

      // Download actual image binary and append to FormData
      try {
        const imgRes = await fetch(item.imageUrl);
        const arrayBuf = await imgRes.arrayBuffer();
        const blob = new Blob([arrayBuf], { type: 'image/jpeg' });
        formData.append('image', blob, `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`);
      } catch (imgErr) {
        console.warn('Image fetch warning, appending fallback blob:', imgErr.message);
        const dummyBlob = new Blob(['sample-img'], { type: 'image/jpeg' });
        formData.append('image', dummyBlob, 'product.jpg');
      }

      const res = await fetch(`${API_BASE_URL}/add-product.php`, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      const json = await res.json();
      console.log(`✓ Inserted "${item.title}" -> Product ID:`, json.product_id || json);
    } catch (e) {
      console.error(`✕ Error inserting "${item.title}":`, e.message);
    }
  }

  console.log('\n--- Checking live get-products.php API from Database ---');
  const checkRes = await fetch(`${API_BASE_URL}/get-products.php`);
  const checkJson = await checkRes.json();
  console.log('Total Products in Database now:', checkJson?.data?.length || 0);
  console.log('Products:', JSON.stringify(checkJson.data.map(p => ({ id: p.id, title: p.title, price: p.price, image: p.image })), null, 2));
}

seedLiveDatabase();
