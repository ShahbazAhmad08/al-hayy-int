const http = require('http');

function fetchLocal(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== TEST 1: Proxy /api/proxy/get-products.php ===');
  try {
    const res1 = await fetchLocal('/api/proxy/get-products.php');
    console.log('Status:', res1.status);
    console.log('Headers:', res1.headers['content-type']);
    console.log('Data length:', res1.data.length);
    console.log('Preview:', res1.data.substring(0, 300));
    try {
      const json = JSON.parse(res1.data);
      console.log('JSON success:', json.success, 'Count:', json.data?.length);
    } catch (e) {
      console.log('Parse error:', e.message);
    }
  } catch (e) {
    console.error('Test 1 failed:', e.message);
  }

  console.log('\n=== TEST 2: Proxy /api/proxy/get-categories.php ===');
  try {
    const res2 = await fetchLocal('/api/proxy/get-categories.php');
    console.log('Status:', res2.status);
    console.log('Preview:', res2.data.substring(0, 300));
  } catch (e) {
    console.error('Test 2 failed:', e.message);
  }

  console.log('\n=== TEST 3: SSR / Page Rendering /shop ===');
  try {
    const res3 = await fetchLocal('/shop');
    console.log('Status:', res3.status);
    console.log('HTML Length:', res3.data.length);
    console.log('Contains product titles?:', res3.data.includes('Classic Kani Weave') || res3.data.includes('Pashmina'));
  } catch (e) {
    console.error('Test 3 failed:', e.message);
  }
}

runTests();
