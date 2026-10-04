const http = require('http');

async function testWithHost(hostHeader) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'alhayyinternational-com.stackstaging.com',
      port: 80,
      path: '/v2/api/get-products.php',
      method: 'GET',
      headers: {
        'Host': hostHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ host: hostHeader, status: res.statusCode, length: data.length, preview: data.slice(0, 100) });
      });
    });
    req.on('error', (err) => resolve({ host: hostHeader, error: err.message }));
    req.end();
  });
}

async function run() {
  console.log('Test 1 with Host: alhayyinternational-com.stackstaging.com:');
  const res1 = await testWithHost('alhayyinternational-com.stackstaging.com');
  console.log(res1);

  console.log('\nTest 2 with Host: alhayyinternational.com (forwarded from browser):');
  const res2 = await testWithHost('alhayyinternational.com');
  console.log(res2);
}

run();
