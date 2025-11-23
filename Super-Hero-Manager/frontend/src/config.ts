const normalizeBaseUrl = (url?: string) =>
  url ? url.replace(/\/$/, '') : '';

const ensureLeadingSlash = (path: string) =>
  path.startsWith('/') ? path : `/${path}`;

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const resolveApiUrl = (path: string) => {
  const normalizedPath = ensureLeadingSlash(path);
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};

export const resolveStaticUrl = (path: string) => {
  if (!path) return path;
  const normalizedPath = ensureLeadingSlash(path);
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
