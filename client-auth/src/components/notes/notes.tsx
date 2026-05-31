import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination, type PaginationProps } from '@gravity-ui/uikit';

import Note from '../note/note';
import { useGetNotesByPageMutation } from '../../store/api/notes-api/endpoints';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { notesSelector, setNotes } from '../../store';
import type { NotesProps } from './notes-props';

export default function Notes({ page: forcedPage }: NotesProps) {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(notesSelector);

  const [getNotesByPage] = useGetNotesByPageMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = forcedPage !== undefined ? forcedPage : pageFromUrl;
  const [state, setState] = useState({ page: currentPage, pageSize: 100, total: 0 });
  const handleUpdate: PaginationProps['onUpdate'] = (page, pageSize) => {
    setState((prevState) => ({ ...prevState, page, pageSize }));

    if (page === 1) {
      navigate('/');
    } else {
      navigate(`/notes?page=${page}`);
    }    
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data, total } = await getNotesByPage(state.page).unwrap();
        dispatch(setNotes({ notes: data }));
        setState((prevState) => ({ ...prevState, total }));
      } catch (error) {
        console.error('Failed to fetch notes for page', state.page, error);
      }
    };
  
    fetchNotes();
  }, [state.page, getNotesByPage, dispatch]);

  return (
    <main className="main">
      {notes?.map((note) => (
        <Note
          key={note.id}
          note={note}
        />
      ))}

      <Pagination
        page={state.page}
        pageSize={state.pageSize}
        total={state.total}
        onUpdate={handleUpdate}
      />
    </main>
  )
}
