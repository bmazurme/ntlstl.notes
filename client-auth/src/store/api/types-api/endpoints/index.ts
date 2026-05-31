import typesApi from '../index';

export type Type = {
  id: number;
  name: string;
  description: string;
  link: string;
};

const typesApiEndpoints = typesApi
  .enhanceEndpoints({
    addTagTypes: ['Types'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTypes: builder.mutation<Type[], void>({
        query: () => ({
          url: 'types',
          method: 'GET',
        }),
        invalidatesTags: ['Types'],
      }),
    }),
  });

export const {
  useGetTypesMutation,
} = typesApiEndpoints;
export { typesApiEndpoints };
