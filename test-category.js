// test-category.js
const API_BASE_URL = 'http://alhayyinternational-com.stackstaging.com/v2/api';

async function testCategory() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Origin': 'http://alhayyinternational-com.stackstaging.com',
    'Referer': 'http://alhayyinternational-com.stackstaging.com/',
    'Accept': 'application/json, text/plain, */*'
  };

  // Test with no category_id or null
  for (const catVal of ['', 'null', '0', undefined]) {
    const formData = new FormData();
    formData.append('title', 'Red Kashmiri Aari Embroidered Cotton Kurti');
    formData.append('description', 'Authentic hand-embroidered kurti');
    formData.append('price', '999');
    formData.append('discount_price', '899');
    if (catVal !== undefined) {
      formData.append('category_id', catVal);
    }
    formData.append('is_featured', '1');
    formData.append('variants', JSON.stringify([{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }]));

    const dummyBlob = new Blob(['sample-img'], { type: 'image/jpeg' });
    formData.append('image', dummyBlob, 'test.jpg');

    const res = await fetch(`${API_BASE_URL}/add-product.php`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    const text = await res.text();
    console.log(`Testing category_id=${catVal}:`, text);
  }
}

testCategory();
