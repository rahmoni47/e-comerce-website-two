// API layer: endpoints taken from the OpenAPI spec (no extra prefixes).
const BASE = (import.meta.env.VITE_API_BASE_URL || 'https://store-1-r9p7.onrender.com').replace(/\/$/, '');

async function request(path, { params, method = 'GET', body } = {}) {
  const qs = params ? '?' + new URLSearchParams(params) : '';
  const res = await fetch(BASE + path + qs, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try { const j = await res.json(); msg = j.message || j.error || msg; } catch { /* no body */ }
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const img = (src) => !src ? '' : /^(https?:|data:)/.test(src) ? src : BASE + (src.startsWith('/') ? '' : '/') + src;
export { money } from './lib.jsx';
export const api = {
  products: (page = 0, size = 100) => request('/api/v1/products', { params: { page, size } }),
  product: (id) => request(`/api/v1/products/${id}`),
  categories: () => request('/api/v1/categories/all'),
  category: (id) => request(`/api/v1/categories/${id}`), // includes its products
  states: () => request('/api/v1/states/available'),
  createOrder: (body) => request('/api/v1/orders', { method: 'POST', body }),
};
