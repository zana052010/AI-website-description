import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const LOGO_DIR = path.join(ROOT, 'public', 'assets', 'logos');
const PREVIEW_DIR = path.join(ROOT, 'public', 'assets', 'previews');
const ICON_DIR = path.join(ROOT, 'public', 'assets', 'icons');
const PUBLIC_DIR = path.join(ROOT, 'public');

// Pinned so the visual result is reproducible.
const LOBE_VERSION = '1.95.1';
const LOBE_SOURCES = [
  `https://unpkg.com/@lobehub/icons-static-svg@${LOBE_VERSION}/icons`,
  `https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@${LOBE_VERSION}/icons`,
];

const LOGOS = [
  { file: 'openai', slug: 'openai' },
  { file: 'claude', slug: 'claude-color' },
  { file: 'deepseek', slug: 'deepseek-color' },
  { file: 'gemini', slug: 'gemini-color' },
  { file: 'midjourney', slug: 'midjourney' },
  { file: 'suno', slug: 'suno' },
  { file: 'cursor', slug: 'cursor' },
  { file: 'opencode', slug: 'opencode' },
  { file: 'runway', slug: 'runway' },
  { file: 'sora', slug: 'sora-color' },
  { file: 'ollama', slug: 'ollama' },
  { file: 'meta', slug: 'meta-color' },
  { file: 'elevenlabs', slug: 'elevenlabs' },
  { file: 'perplexity', slug: 'perplexity-color' },
  { file: 'comfyui', slug: 'comfyui-color' },
  { file: 'flux', slug: 'flux' },
];

const BRAND_ICONS = [
  {
    file: 'github',
    url: 'https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/github.svg',
  },
];

const PREVIEWS = {
  chatgpt: '1516321318423-f06f85e504b3',
  claude: '1455390582262-044cdead277a',
  deepseek: '1558494949-ef010cbdcc31',
  gemini: '1451187580459-43490279c0fa',
  midjourney: '1547891654-e66ed7ebb968',
  suno: '1493225457124-a3eb161ffa5f',
  'cursor-opencode': '1555066931-4365d14bab8c',
  'runway-sora': '1485846234645-a62644f84728',
  'ollama-llama': '1518770660439-4636190af475',
  elevenlabs: '1478737270239-2f02b77fc618',
  perplexity: '1481627834876-b7833e8f5570',
  'comfyui-flux': '1541701494587-cb58502866ab',
};

const USER_AGENT = 'neural-bento-asset-pipeline/1.0 (+https://github.com/zana)';

async function fetchChecked(url, accept) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: accept,
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} — ${url}`);
  }

  return response;
}

async function syncLogo({ file, slug }) {
  const errors = [];

  for (const source of LOBE_SOURCES) {
    const url = `${source}/${slug}.svg`;

    try {
      const response = await fetchChecked(url, 'image/svg+xml');
      const svg = await response.text();

      if (!svg.trimStart().startsWith('<svg')) {
        throw new Error('response is not an SVG document');
      }

      if (/<script[\s>]/i.test(svg)) {
        throw new Error('unexpected script tag in SVG');
      }

      await writeFile(path.join(LOGO_DIR, `${file}.svg`), svg, 'utf8');
      console.log(`logo   ${file.padEnd(12)} ${slug}.svg  ${Buffer.byteLength(svg)} bytes`);
      return { file, slug, source: url, bytes: Buffer.byteLength(svg) };
    } catch (error) {
      errors.push(`${url} — ${error.message}`);
    }
  }

  throw new Error(`Could not download logo "${file}":\n${errors.join('\n')}`);
}

async function syncBrandIcon({ file, url }) {
  const response = await fetchChecked(url, 'image/svg+xml');
  const svg = await response.text();

  if (!svg.trimStart().startsWith('<svg')) {
    throw new Error(`Brand icon for "${file}" is not an SVG document`);
  }

  await writeFile(path.join(ICON_DIR, `${file}.svg`), svg, 'utf8');
  console.log(`icon   ${file.padEnd(12)} ${svg.length} bytes`);

  return { file, source: url, bytes: Buffer.byteLength(svg) };
}

async function syncPreview(id, photoId) {
  const url = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=1600&h=900&q=80`;
  const response = await fetchChecked(url, 'image/jpeg');
  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.length < 30_000) {
    throw new Error(`Preview for "${id}" is suspiciously small (${buffer.length} bytes)`);
  }

  const target = path.join(PREVIEW_DIR, `${id}.jpg`);
  await writeFile(target, buffer);
  console.log(`photo  ${id.padEnd(16)} ${photoId}  ${(buffer.length / 1024).toFixed(0)} KB`);

  return { id, photoId, source: url, bytes: buffer.length };
}

async function writeFavicon() {
  const lucidePath = path.join(ROOT, 'node_modules', 'lucide-static', 'icons', 'layout-grid.svg');
  const svg = await readFile(lucidePath, 'utf8');
  const inner = svg
    .replace(/^[\s\S]*?<svg\b[^>]*>/i, '')
    .replace(/<\/svg>[\s\S]*$/i, '')
    .trim();

  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#09090B"/><g transform="translate(7 7) scale(0.75)" fill="none" stroke="#FAFAFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>\n`;

  await writeFile(path.join(PUBLIC_DIR, 'favicon.svg'), favicon, 'utf8');
  console.log('icon   favicon.svg  generated from Lucide layout-grid');
}

async function main() {
  await mkdir(LOGO_DIR, { recursive: true });
  await mkdir(PREVIEW_DIR, { recursive: true });
  await mkdir(ICON_DIR, { recursive: true });

  const logos = [];
  for (const logo of LOGOS) {
    logos.push(await syncLogo(logo));
  }

  const brandIcons = [];
  for (const icon of BRAND_ICONS) {
    brandIcons.push(await syncBrandIcon(icon));
  }

  const previews = [];
  for (const [id, photoId] of Object.entries(PREVIEWS)) {
    previews.push(await syncPreview(id, photoId));
  }

  await writeFavicon();

  const credits = {
    generatedBy: 'scripts/sync-assets.mjs',
    logos: {
      source: 'LobeHub Icons',
      version: LOBE_VERSION,
      license: 'https://github.com/lobehub/lobe-icons/blob/master/LICENSE',
      files: logos,
    },
    previews: {
      source: 'Unsplash',
      license: 'https://unsplash.com/license',
      photos: previews,
    },
    brandIcons: {
      source: 'Simple Icons',
      license: 'https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md',
      files: brandIcons,
    },
    uiIcons: {
      source: 'Lucide',
      package: 'lucide-static',
      license: 'https://lucide.dev/license',
    },
  };

  await writeFile(
    path.join(PUBLIC_DIR, 'assets', 'credits.json'),
    `${JSON.stringify(credits, null, 2)}\n`,
    'utf8',
  );

  console.log(
    `\nDone: ${logos.length} logos, ${previews.length} previews, ${brandIcons.length} brand icon, 1 favicon.`,
  );
}

main().catch((error) => {
  console.error(`\nAsset sync failed: ${error.message}`);
  process.exitCode = 1;
});
