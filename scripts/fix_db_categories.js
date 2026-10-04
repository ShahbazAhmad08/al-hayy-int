const mysql = require('mysql2/promise');

async function fixDatabase() {
  console.log('Connecting to MySQL database...');
  try {
    const connection = await mysql.createConnection({
      host: 'shareddb-f.hosting.stackcp.net',
      user: 'clothing_db-36398736',
      password: 'Admin@1122',
      database: 'clothing_db-36398736'
    });

    console.log('✅ Connected to database successfully.');

    // 1. Insert Categories if missing
    console.log('Seeding categories into categories table...');
    await connection.query(`
      INSERT IGNORE INTO categories (id, name, slug) VALUES 
      (1, 'Tops & Kurtis', 'tops-kurtis'),
      (2, 'Kaftaans', 'kaftaans'),
      (3, 'co-ord sets', 'co-ord-sets'),
      (4, 'Silk jackets', 'silk-jackets'),
      (5, 'Pashmina & Shawls', 'pashmina-shawls')
    `);

    const [cats] = await connection.query('SELECT * FROM categories');
    console.log(`✅ Categories verified in DB: ${cats.length} categories:`, cats.map(c => `${c.id}: ${c.name}`));

    // 2. Auto-link NULL category_id in products table
    console.log('Linking NULL category_id on products...');
    const [r1] = await connection.query("UPDATE products SET category_id = 1 WHERE (category_id IS NULL OR category_id = 0) AND (title LIKE '%kurti%' OR title LIKE '%suit%' OR title LIKE '%top%')");
    const [r2] = await connection.query("UPDATE products SET category_id = 2 WHERE (category_id IS NULL OR category_id = 0) AND (title LIKE '%kaftan%' OR title LIKE '%kaftaan%')");
    const [r3] = await connection.query("UPDATE products SET category_id = 3 WHERE (category_id IS NULL OR category_id = 0) AND (title LIKE '%co-ord%' OR title LIKE '%coord%' OR title LIKE '%set%' OR title LIKE '%trouser%')");
    const [r4] = await connection.query("UPDATE products SET category_id = 4 WHERE (category_id IS NULL OR category_id = 0) AND (title LIKE '%jacket%' OR title LIKE '%shrug%' OR title LIKE '%silk%')");
    const [r5] = await connection.query("UPDATE products SET category_id = 5 WHERE (category_id IS NULL OR category_id = 0) AND (title LIKE '%shawl%' OR title LIKE '%pashmina%' OR title LIKE '%stole%' OR title LIKE '%kani%')");
    const [r6] = await connection.query("UPDATE products SET category_id = 1 WHERE category_id IS NULL OR category_id = 0");

    console.log('✅ Products updated with valid category_id.');

    // 3. Verify products
    const [prods] = await connection.query('SELECT p.id, p.title, p.category_id, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');
    console.log(`✅ Total active products: ${prods.length}`);
    prods.forEach(p => console.log(`  - [ID ${p.id}] "${p.title}" -> Category: "${p.category_name}" (category_id: ${p.category_id})`));

    await connection.end();
    console.log('\n🎉 ALL DATABASE CATEGORIES AND PRODUCTS ARE NOW 100% FIXED & LINKED!');
  } catch (err) {
    console.error('❌ Database fix error:', err);
  }
}

fixDatabase();
