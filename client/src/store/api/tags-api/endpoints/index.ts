import tagsApi from '../index';

export type TagResponse = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

const tagsApiEndpoints = tagsApi
  .enhanceEndpoints({
    addTagTypes: ['Tags'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTags: builder.mutation<TagResponse[], void>({
        query: () => ({
          url: 'tags',
          method: 'GET',
        }),
        invalidatesTags: ['Tags'],
      }),
    }),
  });

export const { useGetTagsMutation } = tagsApiEndpoints;
export { tagsApiEndpoints };
