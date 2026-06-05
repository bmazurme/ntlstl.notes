import notesApi from '..';

type Note = {
  // id: number;
  title: string;
  preview: string;
  content: string;
  type: string;
  // type: {
  //   id: number;
  // };
};

export type NoteResponse = {
  id: number;
  title: string;
  preview: string;
  content: string;
  type: {
    id: number;
    name: string;
  };
};

const notesApiEndpoints = notesApi
  .enhanceEndpoints({
    addTagTypes: ['Notes'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      createNote: builder.mutation<NoteResponse, Note>({
        query: (data: Note) => ({
          url: '/notes',
          method: 'POST',
          body: { ...data, type: { id: Number(data.type) } },
        }),
        invalidatesTags: ['Notes'],
      }),
      updateNote: builder.mutation<NoteResponse, Note & { id: number }>({
        query: ({ id, ...data }: Note & { id: number }) => ({
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
  useGetNotesByPageMutation,
  useDeleteNoteMutation,
  useGetNotesByTypeMutation,
} = notesApiEndpoints;
export { notesApiEndpoints };
