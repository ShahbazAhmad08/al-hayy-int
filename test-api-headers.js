// test-api-headers.js
const API_BASE_URL = 'http://alhayyinternational-com.stackstaging.com/v2/api';

async function testWithHeaders() {
  const formData = new FormData();
  formData.append('title', 'Red Kashmiri Cotton Kurti');
  formData.append('description', 'Authentic Kashmiri kurti');
  formData.append('price', '999');
  formData.append('discount_price', '899');
  formData.append('category_id', '1');
  formData.append('is_featured', '1');
  formData.append('variants', JSON.stringify([{ size: 'M', stock: 10 }]));

  const dummyBlob = new Blob(['sample-img'], { type: 'image/jpeg' });
  formData.append('image', dummyBlob, 'test.jpg');

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Origin': 'http://alhayyinternational-com.stackstaging.com',
    'Referer': 'http://alhayyinternational-com.stackstaging.com/',
    'Accept': 'application/json, text/plain, */*'
  };

  try {
    const res = await fetch(`${API_BASE_URL}/add-product.php`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

testWithHeaders();
