const { run } = require('./db');

const updates = [
  { id: 1,  url: '/uploads/product-1.png' },
  { id: 2,  url: '/uploads/product-2.png' },
  { id: 3,  url: '/uploads/product-3.png' },
  { id: 4,  url: '/uploads/product-4.png' },
  { id: 5,  url: '/uploads/product-5.png' },
  { id: 6,  url: '/uploads/product-6.png' },
  { id: 7,  url: '/uploads/product-7.png' },
  { id: 8,  url: '/uploads/product-8.png' },
  { id: 9,  url: '/uploads/product-9.png' },
  { id: 10, url: '/uploads/product-10.png' },
  { id: 11, url: '/uploads/product-11.png' },
  { id: 12, url: '/uploads/product-12.png' },
];

async function main() {
  console.log('🖼  Оновлення зображень товарів...\n');
  for (const { id, url } of updates) {
    await run('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
    console.log(`✅ id=${id}: ${url}`);
  }
  console.log('\n✔ Готово!');
  process.exit(0);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
