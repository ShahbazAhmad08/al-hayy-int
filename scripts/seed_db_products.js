const http = require('http');
const fs = require('fs');
const path = require('path');

const PRODUCTS = [
  {
    title: 'Kashmiri Aari Embroidered Royal Kurti Set',
    description: 'Masterfully hand-embroidered by Kashmiri master artisans using authentic Aari needlework. Crafted from breathable, premium combed cotton ideal for festive gatherings and royal comfort.',
    price: '1899',
    discount_price: '1499',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-1.jpg'),
    variants: [
      { size: 'S', stock_quantity: 12 },
      { size: 'M', stock_quantity: 18 },
      { size: 'L', stock_quantity: 14 }
    ]
  },
  {
    title: 'Gilded Zari & Resham Embroidered Suit',
    description: 'A radiant creation adorned with delicate floral vine motifs and metallic thread accents inspired by the historic Mughal gardens of Srinagar.',
    price: '2499',
    discount_price: '1999',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-4.jpg'),
    variants: [
      { size: 'S', stock_quantity: 8 },
      { size: 'M', stock_quantity: 15 },
      { size: 'L', stock_quantity: 12 }
    ]
  },
  {
    title: 'Ivory & Gold Tilla Work Heritage Kurti',
    description: 'Pristine ivory tone infused with fine gold threadwork. Graceful, airy, and effortlessly sophisticated for serene poise and daytime celebrations.',
    price: '2199',
    discount_price: '1799',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-7.jpg'),
    variants: [
      { size: 'S', stock_quantity: 10 },
      { size: 'M', stock_quantity: 20 },
      { size: 'L', stock_quantity: 16 }
    ]
  },
  {
    title: 'Midnight Navy Kashmiri Tilla Work Kurti',
    description: 'Deep royal midnight navy cotton adorned with shimmering metallic accents and floral tapestry. A statement piece that bridges timeless tradition with modern luxury.',
    price: '2799',
    discount_price: '2299',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-9.jpg'),
    variants: [
      { size: 'S', stock_quantity: 9 },
      { size: 'M', stock_quantity: 14 },
      { size: 'L', stock_quantity: 11 }
    ]
  },
  {
    title: 'Emerald Garden Sozni Embroidered Kurti',
    description: 'Rich emerald green canvas highlighted with ultra-fine Sozni needlework depicting the lush valleys of Pahalgam and Gulmarg.',
    price: '2299',
    discount_price: '1899',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-11.jpg'),
    variants: [
      { size: 'S', stock_quantity: 8 },
      { size: 'M', stock_quantity: 12 },
      { size: 'L', stock_quantity: 10 }
    ]
  },
  {
    title: 'Pastel Lavender Aari Summer Kurti Set',
    description: 'Soft lavender pastel tone adorned with subtle floral sprigs hand-stitched by Kashmir artisans. Breeze-light and effortless for festive celebrations.',
    price: '1999',
    discount_price: '1599',
    is_featured: '0',
    imagePath: path.join(__dirname, '../public/images/gallery-13.jpg'),
    variants: [
      { size: 'S', stock_quantity: 6 },
      { size: 'M', stock_quantity: 10 },
      { size: 'L', stock_quantity: 8 }
    ]
  },
  {
    title: 'Crimson Floral Chinar Heritage Suit',
    description: 'Deep crimson fabric celebrating the golden autumnal Chinar leaves with intricate hand embroidery along collar, cuffs, and hem.',
    price: '2699',
    discount_price: '2199',
    is_featured: '0',
    imagePath: path.join(__dirname, '../public/images/gallery-15.jpg'),
    variants: [
      { size: 'S', stock_quantity: 5 },
      { size: 'M', stock_quantity: 11 },
      { size: 'L', stock_quantity: 7 }
    ]
  },
  {
    title: 'Handcrafted Heritage Cotton Kaftan',
    description: 'Discover our collection of handcrafted cotton kaftaans from Kashmir — lightweight, breathable, and designed for effortless bohemian luxury. Flowing silhouette with delicate side tassels.',
    price: '2499',
    discount_price: '1999',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-17.jpg'),
    variants: [
      { size: 'Free Size', stock_quantity: 25 }
    ]
  },
  {
    title: 'Saffron Olive Silk Kaftan with Gold Border',
    description: 'A luxurious drape in earthy saffron olive, finished with delicate hand-braided neckline ties and subtle gold shimmer trims.',
    price: '2899',
    discount_price: '2399',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-19.jpg'),
    variants: [
      { size: 'Free Size', stock_quantity: 18 }
    ]
  },
  {
    title: 'Royal Indigo Floral Flow Kaftan',
    description: 'Deep celestial indigo decorated with white Paisley block prints and delicate mirror accents for effortless evening resort elegance.',
    price: '2699',
    discount_price: '2199',
    is_featured: '0',
    imagePath: path.join(__dirname, '../public/images/gallery-21.jpg'),
    variants: [
      { size: 'Free Size', stock_quantity: 16 }
    ]
  },
  {
    title: 'Dusty Rose Handcrafted Summer Kaftan',
    description: 'Ethereal dusty rose tone with side slits and artisan needle embroidery along the V-neckline. Unmatched comfort for home retreats and seaside vacations.',
    price: '2599',
    discount_price: '2099',
    is_featured: '0',
    imagePath: path.join(__dirname, '../public/images/gallery-23.jpg'),
    variants: [
      { size: 'Free Size', stock_quantity: 14 }
    ]
  },
  {
    title: 'Artisan Embroidered Kashmiri Co-Ord Set',
    description: 'Contemporary two-piece silhouette featuring cropped tunic and wide-leg trousers accented with authentic valley embroidery. Supreme ease and modern couture.',
    price: '3499',
    discount_price: '2899',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-25.jpg'),
    variants: [
      { size: 'S', stock_quantity: 7 },
      { size: 'M', stock_quantity: 12 },
      { size: 'L', stock_quantity: 9 }
    ]
  },
  {
    title: 'Sage Green Linen Hand-Embroidered Co-Ord Set',
    description: 'Tailored sage green notch-collar tunic paired with straight-fit trousers. Hand-embroidered botanical vines grace the lapel and cuffs.',
    price: '3799',
    discount_price: '3199',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-27.jpg'),
    variants: [
      { size: 'S', stock_quantity: 6 },
      { size: 'M', stock_quantity: 9 },
      { size: 'L', stock_quantity: 7 }
    ]
  },
  {
    title: 'Ivory Chinar Tapered Trouser & Tunic Set',
    description: 'Understated luxury in warm ivory mulmul. Features subtle Chinar leaf threadwork along the pocket openings and sleeve hem.',
    price: '3999',
    discount_price: '3399',
    is_featured: '0',
    imagePath: path.join(__dirname, '../public/images/gallery-29.jpg'),
    variants: [
      { size: 'S', stock_quantity: 5 },
      { size: 'M', stock_quantity: 8 },
      { size: 'L', stock_quantity: 6 }
    ]
  },
  {
    title: 'Royal Silk Hand-Embroidered Valley Jacket',
    description: 'Pure Mulberry silk jacket tailored with all-over intricate Kashmiri needlework. Lined with rich satin for gala evenings, weddings, and high luxury occasions.',
    price: '5999',
    discount_price: '4899',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-31.jpg'),
    variants: [
      { size: 'S', stock_quantity: 4 },
      { size: 'M', stock_quantity: 6 },
      { size: 'L', stock_quantity: 5 }
    ]
  },
  {
    title: 'Obsidian Black Tilla Embroidered Silk Shrug',
    description: 'Drape yourself in royal Kashmiri opulence with fine gold Tilla embroidery hand-stitched over midnight raw silk.',
    price: '6299',
    discount_price: '5199',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-33.jpg'),
    variants: [
      { size: 'S', stock_quantity: 3 },
      { size: 'M', stock_quantity: 5 },
      { size: 'L', stock_quantity: 4 }
    ]
  },
  {
    title: 'Sapphire Velvet Heritage Evening Jacket',
    description: 'Sumptuous royal sapphire micro-velvet jacket adorned with silver thread Kashmiri vines. Luxurious satin lining ensures exceptional warmth and majesty.',
    price: '6699',
    discount_price: '5599',
    is_featured: '0',
    imagePath: path.join(__dirname, '../public/images/gallery-35.jpg'),
    variants: [
      { size: 'S', stock_quantity: 3 },
      { size: 'M', stock_quantity: 4 },
      { size: 'L', stock_quantity: 3 }
    ]
  },
  {
    title: 'Pure Kashmiri Heritage Pashmina Shawl (Royal Navy Packaging)',
    description: 'Authentic 100% Changthangi goat Pashmina, handspun and hand-woven on heritage wooden looms. Delivered in the signature Al Hayy Midnight Navy & Gold Foil presentation box.',
    price: '8999',
    discount_price: '6999',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/hero-packaging.jpg'),
    variants: [
      { size: 'Full (2m x 1m)', stock_quantity: 8 }
    ]
  },
  {
    title: 'Classic Kani Weave Antique Border Shawl',
    description: 'Iconic Kanihama wooden needle-woven shawl displaying traditional paisley and flora patterns. A timeless heirloom created over months of master weaving.',
    price: '9499',
    discount_price: '7499',
    is_featured: '1',
    imagePath: path.join(__dirname, '../public/images/gallery-39.jpg'),
    variants: [
      { size: 'Full (2m x 1m)', stock_quantity: 5 }
    ]
  }
];

async function uploadSingle(prod) {
  const fileBytes = fs.readFileSync(prod.imagePath);
  const blob = new Blob([fileBytes], { type: 'image/jpeg' });
  const formData = new FormData();

  formData.append('title', prod.title);
  formData.append('description', prod.description);
  formData.append('price', String(prod.price));
  formData.append('discount_price', String(prod.discount_price));
  formData.append('is_featured', String(prod.is_featured));
  formData.append('image', blob, path.basename(prod.imagePath));
  formData.append('variants', JSON.stringify(prod.variants));

  const res = await fetch('http://alhayyinternational-com.stackstaging.com/v2/api/add-product.php', {
    method: 'POST',
    body: formData,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'http://alhayyinternational-com.stackstaging.com',
      'Referer': 'http://alhayyinternational-com.stackstaging.com/',
      'Accept': 'application/json, text/plain, */*'
    }
  });

  const status = res.status;
  try {
    const json = await res.json();
    return { status, data: json };
  } catch (err) {
    const text = await res.text();
    return { status, text: text.slice(0, 300) };
  }
}

async function main() {
  console.log('--- Cleaning existing products from DB ---');
  const getRes = await fetch('http://alhayyinternational-com.stackstaging.com/v2/api/get-products.php');
  const getJson = await getRes.json();
  if (getJson.data && Array.isArray(getJson.data)) {
    for (const p of getJson.data) {
      await fetch('http://alhayyinternational-com.stackstaging.com/v2/api/delete-product.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id })
      });
      console.log('Deleted old product ID:', p.id);
    }
  }

  console.log('\n--- Seeding ' + PRODUCTS.length + ' real products into MySQL database with image uploads ---');
  for (let i = 0; i < PRODUCTS.length; i++) {
    const prod = PRODUCTS[i];
    console.log(`[${i + 1}/${PRODUCTS.length}] Uploading & adding "${prod.title}"...`);
    const res = await uploadSingle(prod);
    console.log('   Result:', res);
  }

  console.log('\n--- Verifying live database products ---');
  const verifyRes = await fetch('http://alhayyinternational-com.stackstaging.com/v2/api/get-products.php');
  const verifyJson = await verifyRes.json();
  console.log('Total live DB products:', verifyJson.data ? verifyJson.data.length : 0);
  if (verifyJson.data && verifyJson.data.length > 0) {
    console.log('Sample item 0:', {
      id: verifyJson.data[0].id,
      title: verifyJson.data[0].title,
      price: verifyJson.data[0].price,
      discount_price: verifyJson.data[0].discount_price,
      image_url: verifyJson.data[0].image_url,
      variants_count: verifyJson.data[0].variants ? verifyJson.data[0].variants.length : 0
    });
  }
}

main().catch(console.error);
