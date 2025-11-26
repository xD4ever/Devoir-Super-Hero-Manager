import { Hero } from '../types/Hero';
import { resolveStaticUrl } from '../config';

export const resolveHeroImage = (image?: string) => {
  if (!image) {
    return 'https://via.placeholder.com/320x420?text=Hero';
  }

  const normalized = image.replace(/\\/g, '/').trim();
  if (!normalized) {
    return 'https://via.placeholder.com/320x420?text=Hero';
  }

  if (normalized.startsWith('http')) return normalized;

  if (normalized.startsWith('/uploads') || normalized.startsWith('uploads')) {
    const relative = normalized.startsWith('/uploads')
      ? normalized
      : `/${normalized}`;
    return resolveStaticUrl(relative);
  }

  const sanitized = normalized.replace(/^\/+/, '');
  const isSeededImage = /^(xs|sm|md|lg)\//i.test(sanitized);
  const basePath = isSeededImage
    ? `/uploads/images/${sanitized}`
    : `/uploads/${sanitized}`;

  return resolveStaticUrl(basePath);
};

export const extractHeroSummary = (hero: Hero, maxLength = 120) => {
  if (!hero.description) return '';
  return hero.description.length > maxLength
    ? `${hero.description.slice(0, maxLength)}…`
    : hero.description;
};

export const formatHeroPowers = (pouvoirs: string[]) =>
  pouvoirs
    .map(p => p.trim())
    .filter(Boolean)
    .join(', ');

export const filterHeroes = (
  heroes: Hero[],
  query: string,
  universe: 'Tous' | 'Marvel' | 'DC' | 'Autre',
) => {
  const q = query.trim().toLowerCase();
  return heroes.filter(hero => {
    if (universe !== 'Tous' && hero.univers !== universe) return false;

    if (!q) return true;

    const text = `${hero.nom} ${hero.alias}`.toLowerCase();
    return text.includes(q);
  });
};

export const sortHeroes = (heroes: Hero[], sort: 'name' | 'createdAt') => {
  const copy = [...heroes];
  if (sort === 'name') {
    copy.sort((a, b) => a.nom.localeCompare(b.nom));
  } else {
    copy.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }
  return copy;
};
