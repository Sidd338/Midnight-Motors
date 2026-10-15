const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function run() {
  const qList = ['Audi RS6', 'Nissan Skyline GT-R', 'Toyota Supra', 'Mazda RX-7', 'Ferrari F40', 'Porsche GT3 RS', 'Bugatti Chiron', 'Ducati Panigale'];
  for (const q of qList) {
    try {
      const html = await get('https://unsplash.com/s/photos/' + encodeURIComponent(q));
      const matches = [...html.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g)].map(m => m[0]);
      const unique = [...new Set(matches)].slice(0, 3);
      console.log(q, unique);
    } catch (e) {
      console.error(q, e.message);
    }
  }
}
run();
