import authApi from '..';

type LoginResponse = {
  accessToken: string;
  expiresIn: number;
};

type CheckAuthResponse = {
  accessToken: string;
  isAuthenticated: boolean;
};

const authApiEndpoints = authApi
  .enhanceEndpoints({
    addTagTypes: ['Auth'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      refresh: builder.mutation<LoginResponse, void>({
        query: () => ({
          url: '/auth/refresh',
          method: 'POST',
        }),
        invalidatesTags: ['Auth'],
      }),
      logout: builder.mutation<void, void>({
        query: () => ({
          url: '/auth/logout',
          method: 'POST',
        }),
        invalidatesTags: ['Auth'],
      }),
      checkAuth: builder.query<CheckAuthResponse, void>({
        query: () => ({
          url: '/auth/check',
          method: 'GET',
        }),
        providesTags: ['Auth'],
        keepUnusedDataFor: 0,
      }),
    }),
  });

export const {
  useRefreshMutation,
  useLogoutMutation,
  useCheckAuthQuery,
} = authApiEndpoints;
export { authApiEndpoints };
