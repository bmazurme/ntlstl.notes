export const { VITE_TOKEN } = import.meta.env;
export const BASE_PROJECT_API_URL = import.meta.env.VITE_API_DOMAIN || 'http://localhost:3000/api/v1';

export const TYPE_COLORS: Record<number, string> = {
  1: '#4aa1f2',
  2: '#f29c39',
  3: '#a575d6',
  4: '#5fb8a5',
};
