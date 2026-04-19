import authApi from '..';

type LoginRequest = {
  username: string;
  password: string;
};

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
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (loginData) => ({
          url: '/auth/login',
          method: 'POST',
          body: loginData,
        }),
        invalidatesTags: ['Auth'],
      }),
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
      }),
    }),
  });

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useCheckAuthQuery,
} = authApiEndpoints;
export { authApiEndpoints };
