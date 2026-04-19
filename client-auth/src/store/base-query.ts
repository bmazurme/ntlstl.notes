import { fetchBaseQuery } from '@reduxjs/toolkit/query';

import type { RootState } from '../store';

const BASE_PROJECT_API_URL = import.meta.env.VITE_API_DOMAIN || 'http://localhost:3000';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_PROJECT_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth.accessToken;
    console.log('Preparing headers with accessToken:', accessToken);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
  // prepareHeaders: (headers) => headers,
  credentials: 'include',
});

export default baseQuery;
