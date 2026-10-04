const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- 1. Testing get-products.php ---');
  try {
    const prodRes = await fetchUrl('http://alhayyinternational-com.stackstaging.com/v2/api/get-products.php');
    console.log('Status:', prodRes.statusCode);
    console.log('Headers Content-Type:', prodRes.headers['content-type']);
    console.log('Raw Data Length:', prodRes.data.length);
    console.log('Raw Data Preview:', prodRes.data.substring(0, 300));
    try {
      const parsed = JSON.parse(prodRes.data);
      console.log('Parsed Success:', parsed.success, 'Count:', parsed.data?.length);
    } catch (e) {
      console.log('JSON Parse Failed:', e.message);
    }
  } catch (e) {
    console.error('get-products error:', e.message);
  }

  console.log('\n--- 2. Testing get-categories.php ---');
  try {
    const catRes = await fetchUrl('http://alhayyinternational-com.stackstaging.com/v2/api/get-categories.php');
    console.log('Status:', catRes.statusCode);
    console.log('Headers Content-Type:', catRes.headers['content-type']);
    console.log('Raw Data Length:', catRes.data.length);
    console.log('Raw Data Preview:', catRes.data.substring(0, 300));
    try {
      const parsed = JSON.parse(catRes.data);
      console.log('Parsed Success:', parsed.success, 'Count:', parsed.data?.length);
    } catch (e) {
      console.log('JSON Parse Failed:', e.message);
    }
  } catch (e) {
    console.error('get-categories error:', e.message);
  }
}

run();
