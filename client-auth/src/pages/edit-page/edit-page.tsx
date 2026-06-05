import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '@gravity-ui/uikit';

import EditForm from '../../components/edit-form/edit-form';
import ContentWrapper from '../../components/content-wrapper';
import { typesSelector, useGetNoteByIdQuery, useUpdateNoteMutation } from '../../store';
import { useAppSelector } from '../../hooks';
import type { FormPayload } from '../../components/edit-form/edit-form-payload';

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
    } catch (error) {
      console.error('Ошибка при сохранении заметки:', error);
    }
  };

  return (
    <ContentWrapper>
      <div className={style.container}>
        {isLoading || !data
          ? <Loader size="l" />
          : <EditForm
              title="Editing"
              data={data}
              action={onSubmit}
            />}
      </div>
    </ContentWrapper>
  );
};
