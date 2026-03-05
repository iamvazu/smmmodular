import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the locations array data
// Since it's typescript, we will read the file and extract the slugs for simplicity to avoid ts-node in build
const locationsRaw = fs.readFileSync(path.resolve(__dirname, '../src/data/pseo/locations.ts'), 'utf-8');
const slugs = [];
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = slugRegex.exec(locationsRaw)) !== null) {
    slugs.push(match[1]);
}

const BASE_URL = 'https://smmmodular-5ce23f85d0ee.herokuapp.com';

const staticPaths = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/services', priority: 0.8, changefreq: 'monthly' },
    { url: '/our-factory', priority: 0.7, changefreq: 'monthly' },
    { url: '/residential', priority: 0.8, changefreq: 'monthly' },
    { url: '/commercial', priority: 0.8, changefreq: 'monthly' },
    { url: '/corporate', priority: 0.8, changefreq: 'monthly' }
];

const dynamicPaths = slugs.map((slug) => ({
    url: `/location/${slug}`,
    changefreq: 'monthly',
    priority: 0.7,
}));

const paths = [...staticPaths, ...dynamicPaths];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${paths
        .map(
            (path) => `
    <url>
      <loc>${BASE_URL}${path.url}</loc>
      <changefreq>${path.changefreq}</changefreq>
      <priority>${path.priority.toFixed(1)}</priority>
    </url>`
        )
        .join('')}
</urlset>`;

const outputDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.resolve(outputDir, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`✅ Sitemap successfully generated with ${paths.length} URLs at public/sitemap.xml`);
