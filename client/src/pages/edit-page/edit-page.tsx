import { Loader } from '@gravity-ui/uikit';
import { useNavigate, useParams } from 'react-router-dom';

import ContentWrapper from '../../components/content-wrapper';
import EditForm from '../../components/edit-form/edit-form';
import type { FormPayload } from '../../components/edit-form/edit-form-payload';
import PageMeta from '../../components/page-meta';
import { useAppSelector } from '../../hooks';
import { toaster } from '../../main';
import { typesSelector, useGetNoteByIdQuery, useUpdateNoteMutation } from '../../store';

import style from './edit-page.module.css';

export default function EditPage() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const types = useAppSelector(typesSelector);
  const { data, isLoading } = useGetNoteByIdQuery(+noteId!);
  const [updateNote] = useUpdateNoteMutation();

  const onSubmit = async (formData: FormPayload) => {
    const typeId = typeof formData.type === 'string'
      ? String(types.find((t) => t.name === formData.type)!.id)
      : formData.type[0];

    try {
      await updateNote({ id: +noteId!, ...formData, type: typeId });
      navigate(`/note/${noteId}`);
    } catch {
      toaster.add({
        name: 'update-note-error',
        title: 'Не удалось сохранить заметку',
        theme: 'danger',
      });
    }
  };

  return (
    <ContentWrapper sidebar>
      <PageMeta title={data ? `Редактирование — ${data.title}` : 'Редактирование'} />
      <div className={style.container}>
        {isLoading || !data
          ? (
            <Loader
              size="l"
              aria-label="Загрузка заметки"
            />
          )
          : (
            <EditForm
              title="Editing"
              data={data}
              action={onSubmit}
            />
          )}
      </div>
    </ContentWrapper>
  );
}
