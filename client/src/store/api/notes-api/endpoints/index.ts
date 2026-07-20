import notesApi from '..';

type NotePayload = {
  title: string;
  preview: string;
  content: string;
  type: string;
};

export type NoteResponse = {
  id: number;
  slug: string;
  title: string;
  preview: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  type: {
    id: number;
    name: string;
    color: string;
  };
};

const notesApiEndpoints = notesApi
  .enhanceEndpoints({
    addTagTypes: ['Notes'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      createNote: builder.mutation<NoteResponse, NotePayload>({
        query: (data: NotePayload) => ({
          url: '/notes',
          method: 'POST',
          body: { ...data, type: { id: Number(data.type) } },
        }),
        invalidatesTags: ['Notes'],
      }),
      updateNote: builder.mutation<NoteResponse, NotePayload & { id: number }>({
        query: ({ id, ...data }: NotePayload & { id: number }) => ({
          url: `/notes/${id}`,
          method: 'PATCH',
          body: { ...data, type: { id: Number(data.type) } },
        }),
        invalidatesTags: ['Notes'],
      }),
      getNoteById: builder.query<NoteResponse, number>({
        query: (id) => ({
          url: `/notes/${id}`,
          method: 'GET',
        }),
        providesTags: ['Notes'],
      }),
      getNoteBySlug: builder.query<NoteResponse, string>({
        query: (slug) => ({
          url: `/notes/slug/${slug}`,
          method: 'GET',
        }),
        providesTags: ['Notes'],
      }),
      getNotesByPage: builder.mutation<{ data: NoteResponse[]; total: number }, number>({
        query: (page) => ({
          url: `/notes/pages/${page}`,
          method: 'GET',
        }),
        invalidatesTags: ['Notes'],
      }),
      deleteNote: builder.mutation<void, number>({
        query: (id) => ({
          url: `/notes/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Notes'],
      }),
      getNotesByType: builder.mutation<{ data: NoteResponse[]; total: number }, { typeId: number; page: number }>({
        query: ({ typeId, page }) => ({
          url: `/notes/type/${typeId}/pages/${page}`,
          method: 'GET',
        }),
        invalidatesTags: ['Notes'],
      }),
    }),
  });

export const {
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useGetNoteByIdQuery,
  useGetNoteBySlugQuery,
  useGetNotesByPageMutation,
  useDeleteNoteMutation,
  useGetNotesByTypeMutation,
} = notesApiEndpoints;
export { notesApiEndpoints };
