import './style.css';
import modelsData from './data/ai-models.json';
import translations from './i18n/translations.json';

import layoutGridIcon from 'lucide-static/icons/layout-grid.svg?raw';
import searchIcon from 'lucide-static/icons/search.svg?raw';
import xIcon from 'lucide-static/icons/x.svg?raw';
import moonIcon from 'lucide-static/icons/moon.svg?raw';
import sunIcon from 'lucide-static/icons/sun.svg?raw';
import languagesIcon from 'lucide-static/icons/languages.svg?raw';
import rotateCcwIcon from 'lucide-static/icons/rotate-ccw.svg?raw';
import layersIcon from 'lucide-static/icons/layers.svg?raw';
import infoIcon from 'lucide-static/icons/info.svg?raw';
import sendIcon from 'lucide-static/icons/send.svg?raw';
import lockIcon from 'lucide-static/icons/lock.svg?raw';
import arrowUpIcon from 'lucide-static/icons/arrow-up.svg?raw';
import arrowUpRightIcon from 'lucide-static/icons/arrow-up-right.svg?raw';
import arrowRightIcon from 'lucide-static/icons/arrow-right.svg?raw';
import checkIcon from 'lucide-static/icons/check.svg?raw';
import minusIcon from 'lucide-static/icons/minus.svg?raw';
import cpuIcon from 'lucide-static/icons/cpu.svg?raw';
import cloudIcon from 'lucide-static/icons/cloud.svg?raw';
import codeIcon from 'lucide-static/icons/code.svg?raw';
import fileTextIcon from 'lucide-static/icons/file-text.svg?raw';
import imageIcon from 'lucide-static/icons/image.svg?raw';
import musicIcon from 'lucide-static/icons/music.svg?raw';
import listChecksIcon from 'lucide-static/icons/list-checks.svg?raw';
import scanTextIcon from 'lucide-static/icons/scan-text.svg?raw';
import barChartIcon from 'lucide-static/icons/bar-chart-3.svg?raw';
import searchXIcon from 'lucide-static/icons/search-x.svg?raw';
import imageOffIcon from 'lucide-static/icons/image-off.svg?raw';
import tagIcon from 'lucide-static/icons/tag.svg?raw';

const models = Array.isArray(modelsData) ? modelsData : modelsData.models || [];

const STORAGE_KEYS = {
  theme: 'neural-bento:theme',
  lang: 'neural-bento:lang',
};

const CREATOR = {
  github: 'https://github.com/zana052010',
  telegram: 'https://t.me/zana05001',
};

const THEME_COLORS = {
  dark: '#09090B',
  light: '#F8F8F7',
};

const SPAN_CLASS = {
  large: 'md:col-span-2 md:row-span-2',
  medium: 'md:col-span-2 md:row-span-1',
  small: 'md:col-span-1 md:row-span-1',
};

const CATEGORY_KEYS = ['all', 'text', 'coding', 'image', 'video', 'audio', 'local'];

const BENCHMARK_KEYS = ['coding', 'reasoning', 'creativity', 'multimodality', 'speed'];

const MATRIX_TASKS = [
  {
    id: 'coding',
    metric: 'coding',
    icon: 'code',
    subset: (model) => model.category.includes('coding'),
  },
  {
    id: 'context',
    metric: 'reasoning',
    icon: 'file-text',
    subset: (model) => model.category.includes('text'),
  },
  {
    id: 'image',
    metric: 'creativity',
    icon: 'image',
    subset: (model) => model.category.includes('image'),
  },
  {
    id: 'local',
    metric: 'speed',
    icon: 'cpu',
    subset: (model) => model.localRun === true,
  },
  {
    id: 'audio',
    metric: 'creativity',
    icon: 'music',
    subset: (model) => model.category.includes('audio'),
  },
];

const RAW_ICONS = {
  'layout-grid': layoutGridIcon,
  search: searchIcon,
  x: xIcon,
  moon: moonIcon,
  sun: sunIcon,
  languages: languagesIcon,
  'rotate-ccw': rotateCcwIcon,
  layers: layersIcon,
  info: infoIcon,
  send: sendIcon,
  lock: lockIcon,
  'arrow-up': arrowUpIcon,
  'arrow-up-right': arrowUpRightIcon,
  'arrow-right': arrowRightIcon,
  check: checkIcon,
  minus: minusIcon,
  cpu: cpuIcon,
  cloud: cloudIcon,
  code: codeIcon,
  'file-text': fileTextIcon,
  image: imageIcon,
  music: musicIcon,
  'list-checks': listChecksIcon,
  'scan-text': scanTextIcon,
  'bar-chart-3': barChartIcon,
  'search-x': searchXIcon,
  'image-off': imageOffIcon,
  tag: tagIcon,
};

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    /* Preferences are non-critical; private mode may reject writes. */
  }
}

function withSuppressedTransitions(callback) {
  const style = document.createElement('style');
  style.textContent = '*,*::before,*::after{transition:none !important}';
  document.head.append(style);

  void document.body.offsetHeight;
  callback();
  void document.body.offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => style.remove());
  });
}

const storedTheme = readStorage(STORAGE_KEYS.theme);
const storedLang = readStorage(STORAGE_KEYS.lang);
const browserLang = (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru' : 'en';

const state = {
  theme: storedTheme === 'light' ? 'light' : 'dark',
  lang: storedLang === 'ru' || storedLang === 'en' ? storedLang : browserLang,
  category: 'all',
  query: '',
  selectedId: null,
};

const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeValue = document.getElementById('theme-value');
const languageToggle = document.getElementById('language-toggle');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchKbd = document.getElementById('search-kbd');
const filterPills = document.getElementById('filter-pills');
const modelsGrid = document.getElementById('models-grid');
const resultsCopy = document.getElementById('results-copy');
const resetFilters = document.getElementById('reset-filters');
const statModels = document.getElementById('stat-models');
const statCategories = document.getElementById('stat-categories');
const statOpen = document.getElementById('stat-open');
const statOpenCount = document.getElementById('open-count');
const openNote = document.getElementById('open-note');
const openMeter = document.getElementById('open-meter');
const openMeterTrack = document.getElementById('open-meter-track');
const heroMeta = document.getElementById('hero-meta');
const matrixGrid = document.getElementById('matrix-grid');
const modal = document.getElementById('model-modal');
const modalPanel = document.getElementById('modal-panel');
const metaDescription = document.getElementById('meta-description');
const footerRights = document.getElementById('footer-rights');
const backToTop = document.getElementById('back-to-top');
const kbdCommand = document.getElementById('kbd-command');

let lastFocusedElement = null;
let hasRenderedModels = false;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ESCAPE_MAP[character]);
}

function dictionary() {
  return translations[state.lang] || translations.en;
}

function t(path, variables = {}) {
  let value = dictionary();

  for (const key of path.split('.')) {
    value = value?.[key];
    if (value === undefined) break;
  }

  if (typeof value !== 'string') return path;

  return value.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match,
  );
}

function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return new URL(path, document.baseURI).href;
}

function icon(name, className = 'h-4 w-4') {
  if (name === 'github') {
    const maskUrl = assetUrl('./assets/icons/github.svg');
    return `<span class="brand-icon ${className}" style="--brand-icon: url('${maskUrl}')" aria-hidden="true"></span>`;
  }

  const raw = RAW_ICONS[name] || RAW_ICONS.info;

  return raw
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<svg\b([^>]*)>/i, (match, attributes) => {
      const cleaned = attributes
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sstyle="[^"]*"/gi, '')
        .replace(/\s(width|height|stroke-width)="[^"]*"/gi, '');
      return `<svg${cleaned} class="icon-svg ${className}" aria-hidden="true" focusable="false" stroke-width="1.5">`;
    });
}

function hydrateStaticIcons() {
  document.querySelectorAll('.icon-slot[data-icon]').forEach((slot) => {
    if (slot.dataset.iconReady === 'true') return;
    slot.innerHTML = icon(slot.dataset.icon, 'h-full w-full');
    slot.dataset.iconReady = 'true';
  });
}

function initials(name) {
  return String(name)
    .split(/[^A-Za-zА-Яа-яЁё0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function pricingLabel(model) {
  return dictionary().pricing?.[model.pricingModel] || model.pricingModel;
}

function pricingChip(model) {
  const isOpen = model.pricingModel === 'Free / Open-Source' || model.localRun;
  return `<span class="chip">${isOpen ? '<span class="status-dot" aria-hidden="true"></span>' : ''}${esc(
    pricingLabel(model),
  )}</span>`;
}

function deploymentChip(model) {
  return `<span class="chip">${icon(model.localRun ? 'cpu' : 'cloud', 'h-3 w-3')}${esc(
    t(model.localRun ? 'card.local' : 'card.cloud'),
  )}</span>`;
}

function logoImg(src, fallbackUrl, label) {
  return `<img
    class="logo-img"
    src="${esc(assetUrl(src))}"
    alt=""
    width="64"
    height="64"
    loading="lazy"
    decoding="async"
    data-fallback="${esc(fallbackUrl)}"
    onerror="if (this.dataset.fallback && this.src !== this.dataset.fallback) { this.src = this.dataset.fallback; } else { this.style.display = 'none'; this.closest('.logo-tile')?.classList.add('logo-tile--empty'); }"
  />`;
}

function logoTile(src, fallbackUrl, label) {
  return `<span class="logo-tile" data-initials="${esc(initials(label))}">${logoImg(
    src,
    fallbackUrl,
    label,
  )}</span>`;
}

function logoGroup(model, size = 'md', primaryOnly = false) {
  const pair = Boolean(model.secondaryLogoUrl) && !primaryOnly;
  const tiles = [logoTile(model.logoUrl, model.faviconUrl, model.name)];

  if (pair) {
    tiles.push(
      logoTile(model.secondaryLogoUrl, model.secondaryFaviconUrl, model.secondaryLabel || model.provider),
    );
  }

  return `<span class="logo-group logo-group--${size}${pair ? ' logo-group--pair' : ''}" aria-hidden="true">${tiles.join(
    '',
  )}</span>`;
}

function mediaFrame(model, variant = 'card') {
  const isModal = variant === 'modal';

  return `<div class="media-frame${isModal ? ' media-frame--modal' : ''}">
    <img
      class="media-img"
      src="${esc(assetUrl(model.previewImage))}"
      alt="${esc(t('card.previewAlt', { name: model.name }))}"
      width="1600"
      height="900"
      loading="${isModal ? 'eager' : 'lazy'}"
      decoding="async"
      onload="this.classList.add('is-loaded'); this.closest('.media-frame')?.classList.add('is-loaded');"
      onerror="this.closest('.media-frame')?.classList.add('media-frame--error'); this.remove();"
    />
    <span class="media-error-icon">${icon('image-off', 'h-5 w-5')}</span>
  </div>`;
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchIndex(model) {
  const parts = [
    model.name,
    model.provider,
    model.secondaryLabel,
    ...(model.tags || []),
    ...(model.category || []),
  ];

  for (const locale of ['en', 'ru']) {
    const content = model.i18n?.[locale];
    if (!content) continue;
    parts.push(
      content.tagline,
      content.description,
      ...(content.capabilities || []),
      ...(content.useCases || []),
      ...(content.pros || []),
      ...(content.cons || []),
    );
  }

  for (const category of model.category || []) {
    parts.push(translations.en?.filters?.[category], translations.ru?.filters?.[category]);
  }

  return normalizeText(parts.filter(Boolean).join(' '));
}

const SEARCH_INDEX = new Map(models.map((model) => [model.id, buildSearchIndex(model)]));

function matchesQuery(model, query) {
  const tokens = normalizeText(query).split(' ').filter(Boolean);
  if (tokens.length === 0) return true;

  const haystack = SEARCH_INDEX.get(model.id) || '';
  return tokens.every((token) => haystack.includes(token));
}

function searchScore(model, query) {
  if (!query.trim()) return 0;

  const needle = normalizeText(query);
  const name = normalizeText(model.name);
  const provider = normalizeText(model.provider);
  const tags = normalizeText((model.tags || []).join(' '));
  const categories = normalizeText(
    (model.category || [])
      .flatMap((category) => [
        translations.en?.filters?.[category],
        translations.ru?.filters?.[category],
      ])
      .filter(Boolean)
      .join(' '),
  );

  if (name === needle) return 100;
  if (name.startsWith(needle)) return 90;
  if (name.includes(needle)) return 80;
  if (provider.includes(needle)) return 65;
  if (tags.includes(needle)) return 55;
  if (categories.includes(needle)) return 45;
  return 10;
}

function getFilteredModels() {
  const filtered = models.filter((model) => {
    const inCategory = state.category === 'all' || model.category.includes(state.category);
    return inCategory && matchesQuery(model, state.query);
  });

  if (state.query.trim()) {
    filtered.sort((left, right) => searchScore(right, state.query) - searchScore(left, state.query));
  }

  return filtered;
}

function hasActiveFilters() {
  return state.query.trim().length > 0 || state.category !== 'all';
}

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

function applyTheme(theme, persist = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  html.classList.toggle('dark', state.theme === 'dark');
  html.dataset.theme = state.theme;

  if (persist) writeStorage(STORAGE_KEYS.theme, state.theme);

  const themeLabel = t(state.theme === 'dark' ? 'controls.themeDark' : 'controls.themeLight');
  const themeAction = t(state.theme === 'dark' ? 'controls.switchToLight' : 'controls.switchToDark');

  if (themeValue) themeValue.textContent = themeLabel;

  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      `${t('controls.appearance')}: ${themeLabel}. ${themeAction}`,
    );
  }

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute('content', THEME_COLORS[state.theme]);
}

/* ------------------------------------------------------------------ */
/* Language                                                            */
/* ------------------------------------------------------------------ */

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = t(element.dataset.i18n);
    if (value !== element.dataset.i18n) element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
}

function updateMeta() {
  document.title = t('meta.title');
  if (metaDescription) metaDescription.setAttribute('content', t('meta.description'));

  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute('content', t('meta.title'));
  if (ogDescription) ogDescription.setAttribute('content', t('meta.description'));
}

function renderFooter() {
  if (footerRights) {
    footerRights.textContent = t('footer.rights', { year: new Date().getFullYear() });
  }
}

function applyLanguage(lang, persist = true) {
  state.lang = lang === 'ru' ? 'ru' : 'en';
  html.lang = state.lang;

  if (persist) writeStorage(STORAGE_KEYS.lang, state.lang);

  applyTranslations();
  updateMeta();
  applyTheme(state.theme, false);

  if (languageToggle) {
    languageToggle.querySelectorAll('[data-lang]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === state.lang));
    });
  }

  renderFilterPills();
  renderModels();
  renderMatrix();
  renderStats();
  renderFooter();

  if (state.selectedId && modal?.open) renderModal();
}

/* ------------------------------------------------------------------ */
/* Directory                                                           */
/* ------------------------------------------------------------------ */

function renderFilterPills() {
  if (!filterPills) return;

  filterPills.innerHTML = CATEGORY_KEYS.map((key) => {
    const count =
      key === 'all' ? models.length : models.filter((model) => model.category.includes(key)).length;
    const active = state.category === key;

    return `
      <button type="button" class="filter-pill" data-category="${key}" aria-pressed="${active}">
        ${active ? `<span class="filter-check" aria-hidden="true">${icon('check', 'h-3 w-3')}</span>` : ''}
        ${esc(t(`filters.${key}`))}
        <span class="count">${count}</span>
      </button>
    `;
  }).join('');
}

function modelCard(model, index, animate = false) {
  const content = model.i18n[state.lang] || model.i18n.en;
  const size = ['large', 'medium', 'small'].includes(model.gridSpan) ? model.gridSpan : 'small';
  const isLarge = size === 'large';
  const isSmall = size === 'small';
  const padding = isLarge ? 'p-5 sm:p-6' : isSmall ? 'p-4' : 'p-5';
  const logoSize = isLarge ? 'lg' : isSmall ? 'sm' : 'md';
  const nameSize = isLarge ? 'text-xl' : isSmall ? 'text-base' : 'text-lg';
  const spanClass = SPAN_CLASS[size];
  const preview = isLarge ? `<div class="mt-4">${mediaFrame(model)}</div>` : '';
  const tags =
    !isSmall && model.tags?.length
      ? `<div class="mt-3 flex flex-wrap gap-1">${model.tags
          .slice(0, 3)
          .map((tag) => `<span class="model-tag">${esc(tag)}</span>`)
          .join('')}</div>`
      : '';

  return `
    <article
      class="bento-card model-card ${animate ? 'card-enter' : ''} ${spanClass} ${padding}"
      data-size="${size}"
      data-model-id="${esc(model.id)}"
      style="--delay: ${Math.min(index * 40, 200)}ms"
    >
      <button
        type="button"
        class="card-hit"
        data-model-id="${esc(model.id)}"
        aria-haspopup="dialog"
        aria-label="${esc(t('card.open', { name: model.name }))}"
      ></button>

      <div class="relative z-10 flex h-full flex-col">
        <div class="flex items-start justify-between gap-3">
          ${logoGroup(model, logoSize)}
          <span class="card-arrow" aria-hidden="true">${icon('arrow-up-right', 'h-3.5 w-3.5')}</span>
        </div>

        ${preview}

        <div class="mt-4 min-w-0 flex-1">
          <div class="flex items-baseline justify-between gap-2">
            <p class="model-provider">${esc(model.provider)}</p>
            <span class="model-index">${String(index + 1).padStart(2, '0')}</span>
          </div>
          <h3 class="model-name ${nameSize} mt-1 break-words leading-tight">${esc(model.name)}</h3>
          <p class="model-tagline ${isLarge ? 'mt-2 line-clamp-3' : 'mt-2 line-clamp-2'}">
            ${esc(content.tagline)}
          </p>
          ${tags}
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-1.5">
          ${pricingChip(model)}
          ${deploymentChip(model)}
        </div>
      </div>
    </article>
  `;
}

function tailCard(animate = false) {
  return `
    <article class="bento-card ${animate ? 'card-enter' : ''} border-dashed p-5 sm:p-6 md:col-span-4 lg:col-span-3" style="--delay: 0ms">
      <div class="flex items-start justify-between gap-3">
        <span class="icon-orb" aria-hidden="true">${icon('layers', 'h-4 w-4')}</span>
        <span class="font-mono text-[0.6875rem] tracking-[0.06em] text-[color:var(--text-tertiary)]">
          ${models.length} / ${models.length}
        </span>
      </div>
      <div class="mt-4">
        <h3 class="text-lg font-semibold tracking-[-0.01em]">${esc(t('directory.suggestTitle'))}</h3>
        <p class="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-pretty text-[color:var(--text-secondary)]">
          ${esc(t('directory.suggestText'))}
        </p>
        <a class="suggest-link" href="${esc(CREATOR.github)}" target="_blank" rel="noopener noreferrer">
          ${esc(t('directory.suggestCta'))}
          ${icon('arrow-up-right', 'h-3.5 w-3.5')}
        </a>
      </div>
    </article>
  `;
}

function emptyStateHtml(animate = false) {
  const query = state.query.trim();
  const title = query
    ? t('directory.emptyTitle', { query })
    : t('directory.emptyTitleFallback');

  return `
    <div class="empty-state ${animate ? 'card-enter' : ''}" style="--delay: 0ms">
      <span class="empty-icon" aria-hidden="true">${icon('search-x', 'h-5 w-5')}</span>
      <h3 class="mt-4 text-lg font-semibold tracking-[-0.01em]">${esc(title)}</h3>
      <p class="mt-2 max-w-md text-sm leading-relaxed text-[color:var(--text-secondary)]">
        ${esc(t('directory.emptyText', { total: models.length }))}
      </p>
      <button type="button" class="reset-button mt-5" data-reset>
        ${icon('rotate-ccw', 'h-3.5 w-3.5')}
        <span>${esc(t('directory.emptyReset'))}</span>
      </button>
    </div>
  `;
}

function updateDirectoryHeader(filtered) {
  if (resultsCopy) {
    resultsCopy.textContent = t('directory.showing', {
      shown: filtered.length,
      total: models.length,
    });
  }
  if (resetFilters) resetFilters.hidden = !hasActiveFilters();
}

function renderModels() {
  if (!modelsGrid) return;

  const filtered = getFilteredModels();
  const animate = !hasRenderedModels;

  if (filtered.length === 0) {
    modelsGrid.innerHTML = emptyStateHtml(animate);
  } else {
    modelsGrid.innerHTML =
      filtered.map((model, index) => modelCard(model, index, animate)).join('') +
      (hasActiveFilters() ? '' : tailCard(animate));
  }

  hasRenderedModels = true;
  updateDirectoryHeader(filtered);
}

function renderStats() {
  if (!models.length) return;

  const categories = new Set(models.flatMap((model) => model.category));
  const openCount = models.filter(
    (model) => model.pricingModel === 'Free / Open-Source' || model.localRun,
  ).length;
  const openPercent = Math.round((openCount / models.length) * 100);

  if (statModels) statModels.textContent = String(models.length);
  if (statCategories) statCategories.textContent = String(categories.size);
  if (statOpen) statOpen.textContent = String(openPercent);
  if (statOpenCount) statOpenCount.textContent = String(openCount);
  if (openMeter) openMeter.style.width = `${openPercent}%`;

  if (heroMeta) {
    heroMeta.textContent = t('hero.meta', {
      models: models.length,
      categories: categories.size,
    });
  }

  if (openNote) {
    openNote.textContent = t('stats.openNote', { total: models.length });
  }

  if (openMeterTrack) {
    openMeterTrack.setAttribute('aria-valuenow', String(openPercent));
    openMeterTrack.setAttribute('aria-valuetext', `${openPercent}%`);
  }
}

/* ------------------------------------------------------------------ */
/* Comparison matrix                                                   */
/* ------------------------------------------------------------------ */

function benchmark(model, key) {
  const value = Number(model.i18n[state.lang]?.benchmarks?.[key] ?? 0);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, value));
}

function renderMatrix() {
  if (!matrixGrid) return;

  matrixGrid.innerHTML = MATRIX_TASKS.map((task) => {
    const taskCopy = dictionary().matrix?.tasks?.[task.id] || { title: task.id, hint: '' };

    const ranked = models
      .filter(task.subset)
      .sort((left, right) => {
        const scoreDelta = benchmark(right, task.metric) - benchmark(left, task.metric);
        if (scoreDelta !== 0) return scoreDelta;

        const tieBreak = benchmark(right, 'multimodality') - benchmark(left, 'multimodality');
        if (tieBreak !== 0) return tieBreak;

        return left.name.localeCompare(right.name);
      })
      .slice(0, 3);

    return `
      <div class="matrix-column">
        <div class="matrix-head">
          <span class="matrix-task-icon" aria-hidden="true">${icon(task.icon, 'h-4 w-4')}</span>
          <div>
            <h3>${esc(taskCopy.title)}</h3>
            <p>${esc(taskCopy.hint)}</p>
          </div>
        </div>

        <ol class="mt-3 flex-1 space-y-2">
          ${ranked
            .map((model, rank) => {
              const score = benchmark(model, task.metric);

              return `
                <li>
                  <button
                    type="button"
                    class="matrix-row"
                    data-model-id="${esc(model.id)}"
                    data-rank="${rank + 1}"
                    aria-label="${esc(t('card.open', { name: model.name }))}"
                  >
                    <span class="matrix-rank">${String(rank + 1).padStart(2, '0')}</span>
                    ${logoGroup(model, 'xs', true)}
                    <span class="min-w-0 flex-1">
                      <span class="flex items-center justify-between gap-2">
                        <span class="matrix-name">${esc(model.name)}</span>
                        <span class="matrix-score">${score}/10</span>
                      </span>
                      <span class="matrix-bar"><span style="width: ${score * 10}%"></span></span>
                    </span>
                  </button>
                </li>
              `;
            })
            .join('')}
        </ol>
      </div>
    `;
  }).join('');
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

function modalHtml(model) {
  const content = model.i18n[state.lang] || model.i18n.en;
  const copy = dictionary();
  const index = models.findIndex((entry) => entry.id === model.id);
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(models.length).padStart(2, '0')}`;
  const domain = (() => {
    try {
      return new URL(model.officialUrl).hostname.replace(/^www\./, '');
    } catch (error) {
      return model.officialUrl;
    }
  })();
  const providerKey = normalizeText(model.provider).replace(/[^a-z0-9]/g, '');
  const domainKey = normalizeText(domain.split('.')[0]).replace(/[^a-z0-9]/g, '');
  const showDomain = domainKey.length > 0 && !providerKey.includes(domainKey);
  const domainMeta = showDomain
    ? `<span class="font-mono text-[0.6875rem] text-[color:var(--text-tertiary)]">·</span>
       <span class="font-mono text-[0.6875rem] text-[color:var(--text-tertiary)]">${esc(domain)}</span>`
    : '';
  const categoryChips = (model.category || [])
    .map((category) => `<span class="chip">${esc(copy.filters?.[category] || category)}</span>`)
    .join('');

  const capabilities = (content.capabilities || [])
    .map(
      (item) => `
        <li class="flex gap-2.5 text-sm leading-relaxed text-[color:var(--text-secondary)]">
          <span class="mt-0.5 shrink-0 text-[color:var(--text-tertiary)]">
            ${icon('check', 'h-4 w-4')}
          </span>
          <span>${esc(item)}</span>
        </li>
      `,
    )
    .join('');

  const useCases = (content.useCases || [])
    .map(
      (item, itemIndex) => `
        <li class="flex gap-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-2)] p-3">
          <span class="pt-0.5 font-mono text-[0.75rem] text-[color:var(--text-tertiary)]">
            ${String(itemIndex + 1).padStart(2, '0')}
          </span>
          <span class="text-sm leading-relaxed text-[color:var(--text-secondary)]">${esc(item)}</span>
        </li>
      `,
    )
    .join('');

  const benchmarks = BENCHMARK_KEYS.map((key, benchmarkIndex) => {
    const score = benchmark(model, key);

    return `
      <div>
        <div class="flex items-center justify-between gap-2 text-[0.75rem]">
          <span class="text-[color:var(--text-secondary)]">${esc(copy.modal.bench?.[key] || key)}</span>
          <span class="font-mono text-[0.6875rem] text-[color:var(--text-tertiary)]">${score}/10</span>
        </div>
        <div class="bench-track mt-1.5">
          <span class="bench-fill" style="width: ${score * 10}%; --bench-delay: ${benchmarkIndex * 50}ms"></span>
        </div>
      </div>
    `;
  }).join('');

  const pros = (content.pros || [])
    .map(
      (item) => `
        <li class="flex gap-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
          <span class="mt-0.5 shrink-0 text-[color:var(--text-tertiary)]">
            ${icon('check', 'h-3.5 w-3.5')}
          </span>
          <span>${esc(item)}</span>
        </li>
      `,
    )
    .join('');

  const cons = (content.cons || [])
    .map(
      (item) => `
        <li class="flex gap-2 text-sm leading-relaxed text-[color:var(--text-secondary)]">
          <span class="mt-0.5 shrink-0 text-[color:var(--text-tertiary)]">
            ${icon('minus', 'h-3.5 w-3.5')}
          </span>
          <span>${esc(item)}</span>
        </li>
      `,
    )
    .join('');

  return `
    <header class="modal-header">
      <button type="button" class="modal-close" data-close-modal aria-label="${esc(copy.modal.close)}">
        ${icon('x', 'h-4 w-4')}
      </button>

      <div class="flex items-center justify-between gap-3 pr-12">
        <p class="eyebrow">${esc(copy.modal.eyebrow)}</p>
        <span class="font-mono text-[0.6875rem] tracking-[0.06em] text-[color:var(--text-tertiary)]">${counter}</span>
      </div>

      <div class="mt-4 flex items-start gap-4 pr-10">
        ${logoGroup(model, 'xl')}
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p class="model-provider">${esc(model.provider)}</p>
            ${domainMeta}
          </div>
          <h2 id="modal-title" class="mt-1 text-2xl font-semibold tracking-[-0.015em]">
            ${esc(model.name)}
          </h2>
          <p class="mt-2 max-w-[60ch] text-sm leading-relaxed text-pretty text-[color:var(--text-secondary)]">
            ${esc(content.tagline)}
          </p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            ${pricingChip(model)}
            ${deploymentChip(model)}
            ${categoryChips}
          </div>
        </div>
      </div>
    </header>

    <div class="modal-scroll">
      <div class="mb-7">${mediaFrame(model, 'modal')}</div>

      <div class="grid gap-8 lg:grid-cols-2">
        <section>
          <h3 class="modal-section-title">
            ${icon('scan-text', 'h-3.5 w-3.5')}
            ${esc(copy.modal.overview)}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-pretty text-[color:var(--text-secondary)]">
            ${esc(content.description)}
          </p>

          <h3 class="modal-section-title mt-7">
            ${icon('list-checks', 'h-3.5 w-3.5')}
            ${esc(copy.modal.capabilities)}
          </h3>
          <ul class="mt-3 space-y-2.5">${capabilities}</ul>
        </section>

        <section>
          <h3 class="modal-section-title">
            ${icon('arrow-right', 'h-3.5 w-3.5')}
            ${esc(copy.modal.useCases)}
          </h3>
          <ol class="mt-3 space-y-2.5">${useCases}</ol>

          <h3 class="modal-section-title mt-7">
            ${icon('bar-chart-3', 'h-3.5 w-3.5')}
            ${esc(copy.modal.benchmarks)}
          </h3>
          <div class="mt-3 space-y-3">${benchmarks}</div>
        </section>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <section class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
          <h3 class="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-[color:var(--text-tertiary)]">
            ${icon('check', 'h-3.5 w-3.5')}
            ${esc(copy.modal.pros)}
          </h3>
          <ul class="mt-3 space-y-2">${pros}</ul>
        </section>

        <section class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-2)] p-4">
          <h3 class="flex items-center gap-2 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-[color:var(--text-tertiary)]">
            ${icon('minus', 'h-3.5 w-3.5')}
            ${esc(copy.modal.cons)}
          </h3>
          <ul class="mt-3 space-y-2">${cons}</ul>
        </section>
      </div>
    </div>

    <footer class="modal-footer">
      <div class="flex items-center gap-3">
        <span class="modal-price-icon" aria-hidden="true">${icon('tag', 'h-4 w-4')}</span>
        <div>
          <p class="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-[color:var(--text-tertiary)]">
            ${esc(copy.modal.pricing)}
          </p>
          <p class="text-sm font-semibold">${esc(pricingLabel(model))}</p>
        </div>
      </div>

      <a class="cta-primary" href="${esc(model.officialUrl)}" target="_blank" rel="noopener noreferrer">
        ${esc(copy.modal.try)}
        ${icon('arrow-up-right', 'h-4 w-4')}
      </a>
    </footer>
  `;
}

function renderModal() {
  if (!state.selectedId || !modalPanel) return;

  const model = models.find((entry) => entry.id === state.selectedId);
  if (!model) return;

  const currentScroll = modalPanel.querySelector('.modal-scroll')?.scrollTop || 0;

  modalPanel.innerHTML = modalHtml(model);

  const nextScroll = modalPanel.querySelector('.modal-scroll');
  if (nextScroll) nextScroll.scrollTop = currentScroll;

  if (modal?.open) {
    modalPanel.querySelector('[data-close-modal]')?.focus({ preventScroll: true });
  }
}

function openModal(id, trigger = null) {
  const model = models.find((entry) => entry.id === id);
  if (!model) return;

  lastFocusedElement = trigger instanceof HTMLElement ? trigger : document.activeElement;
  state.selectedId = id;
  renderModal();

  if (!modal.open) {
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
  }

  html.classList.add('modal-open');
  modalPanel.querySelector('[data-close-modal]')?.focus({ preventScroll: true });
}

function closeModal() {
  if (!modal) return;

  if (typeof modal.close === 'function' && modal.open) {
    modal.close();
  } else {
    modal.removeAttribute('open');
    html.classList.remove('modal-open');
    state.selectedId = null;
  }
}

/* ------------------------------------------------------------------ */
/* Search and filter actions                                           */
/* ------------------------------------------------------------------ */

function updateSearchUi() {
  if (!searchInput || !searchClear) return;

  const hasQuery = state.query.length > 0;
  searchClear.hidden = !hasQuery;

  if (searchKbd) {
    searchKbd.style.display = hasQuery ? 'none' : '';
  }
}

function setQuery(value) {
  state.query = value;
  updateSearchUi();
  renderModels();
}

function resetAllFilters() {
  state.category = 'all';
  state.query = '';
  if (searchInput) searchInput.value = '';
  updateSearchUi();
  renderFilterPills();
  renderModels();
  searchInput?.focus({ preventScroll: true });
}

function focusSearch() {
  if (!searchInput) return;
  searchInput.focus();
  searchInput.select();
}

/* ------------------------------------------------------------------ */
/* Static decoration                                                   */
/* ------------------------------------------------------------------ */

function setupCreatorLinks() {
  document.querySelectorAll('[data-creator-link]').forEach((link) => {
    const href = CREATOR[link.dataset.creatorLink];
    if (href) link.setAttribute('href', href);
  });
}

function setupKeyboardHint() {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || '');
  const label = isMac ? '⌘ K' : 'Ctrl K';

  if (searchKbd) searchKbd.textContent = label;
  if (kbdCommand) kbdCommand.textContent = label;
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

function bindEvents() {
  themeToggle?.addEventListener('click', () => {
    withSuppressedTransitions(() => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
  });

  languageToggle?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lang]');
    if (!button || button.dataset.lang === state.lang) return;
    applyLanguage(button.dataset.lang);
  });

  filterPills?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;

    state.category = button.dataset.category;

    filterPills.querySelectorAll('[data-category]').forEach((pill) => {
      pill.setAttribute('aria-pressed', String(pill === button));
    });

    renderModels();
  });

  searchInput?.addEventListener('input', (event) => {
    setQuery(event.target.value);
  });

  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const firstCard = modelsGrid?.querySelector('[data-model-id]');
      if (firstCard) {
        event.preventDefault();
        openModal(firstCard.dataset.modelId, searchInput);
      }
    }
  });

  searchClear?.addEventListener('click', () => {
    setQuery('');
    searchInput.value = '';
    searchInput.focus();
  });

  resetFilters?.addEventListener('click', resetAllFilters);

  modelsGrid?.addEventListener('click', (event) => {
    const resetButton = event.target.closest('[data-reset]');
    if (resetButton) {
      resetAllFilters();
      return;
    }

    const card = event.target.closest('[data-model-id]');
    if (card) {
      const trigger = card.matches('.card-hit') ? card : card.querySelector('.card-hit');
      openModal(card.dataset.modelId, trigger || card);
    }
  });

  modelsGrid?.addEventListener('pointermove', (event) => {
    const card = event.target.closest('.model-card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  });

  matrixGrid?.addEventListener('click', (event) => {
    const row = event.target.closest('[data-model-id]');
    if (row) openModal(row.dataset.modelId, row);
  });

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
      return;
    }

    if (event.target.closest('[data-close-modal]')) closeModal();
  });

  modal?.addEventListener('close', () => {
    html.classList.remove('modal-open');
    state.selectedId = null;

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus({ preventScroll: true });
    }
    lastFocusedElement = null;
  });

  window.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    const isTyping =
      activeElement instanceof HTMLElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable);

    const modalOpen = Boolean(modal?.open);

    if (!modalOpen && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      focusSearch();
      return;
    }

    if (!modalOpen && event.key === '/' && !isTyping) {
      event.preventDefault();
      focusSearch();
      return;
    }

    if (event.key === 'Escape' && activeElement === searchInput) {
      if (searchInput.value) {
        setQuery('');
        searchInput.value = '';
      } else {
        searchInput.blur();
      }
    }
  });

  backToTop?.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function init() {
  hydrateStaticIcons();
  setupCreatorLinks();
  setupKeyboardHint();
  applyTheme(state.theme, false);
  applyLanguage(state.lang, false);
  renderStats();
  updateSearchUi();
}

bindEvents();
init();
