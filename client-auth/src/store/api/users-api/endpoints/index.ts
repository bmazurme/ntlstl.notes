import usersApi from '..';

type User = {
  id: number;
  username: string;
  status: string;
};

type UserResponse = {
  id: number;
  username: string;
};

const usersApiEndpoints = usersApi
  .enhanceEndpoints({
    addTagTypes: ['Users'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUserInfo: builder.mutation<UserResponse, void>({
        query: () => ({
          url: '/users/me',
          method: 'GET',
        }),
      }),
      updateUser: builder.mutation<UserResponse, User>({
        query: ({ id, status }: User) => ({
          url: `/users/${id}`,
          method: 'PATCH',
          body: { status },
        }),
        invalidatesTags: ['Users'],
      }),
    }),
  });

export const { useGetUserInfoMutation, useUpdateUserMutation } = usersApiEndpoints;
export { usersApiEndpoints };
