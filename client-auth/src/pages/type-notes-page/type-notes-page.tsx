import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Pagination, type PaginationProps, Skeleton, Text } from '@gravity-ui/uikit';

import ContentWrapper from '../../components/content-wrapper';
import Note from '../../components/note/note';
import { useGetNotesByTypeMutation } from '../../store/api/notes-api/endpoints';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { notesSelector, setNotes } from '../../store';

export default function TypeNotesPage() {
  const { typeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notes = useAppSelector(notesSelector);

  const [searchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const [state, setState] = useState({ page: pageFromUrl, pageSize: 100, total: 0 });

  const [getNotesByType, { isLoading }] = useGetNotesByTypeMutation();

  useEffect(() => {
    if (!typeId) return;
    const fetch = async () => {
      try {
        const { data, total } = await getNotesByType({ typeId: +typeId, page: state.page }).unwrap();
        dispatch(setNotes({ notes: data }));
        setState((prev) => ({ ...prev, total }));
      } catch (error) {
        console.error('Failed to fetch notes by type', error);
      }
    };
    fetch();
  }, [typeId, state.page, getNotesByType, dispatch]);

  const handleUpdate: PaginationProps['onUpdate'] = (page, pageSize) => {
    setState((prev) => ({ ...prev, page, pageSize }));
    navigate(`/notes/type/${typeId}?page=${page}`);
  };

  return (
    <ContentWrapper sidebar>
      <main className="main">
        {isLoading
          ? <Skeleton style={{ width: '100%', minHeight: '240px' }} />
          : notes.length === 0
            ? <Text variant="body-1" color="secondary">Нет заметок этого типа</Text>
            : notes.map((note) => <Note key={note.id} note={note} />)}

        {state.total > state.pageSize && (
          <Pagination
            page={state.page}
            pageSize={state.pageSize}
            total={state.total}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </ContentWrapper>
  );
}
