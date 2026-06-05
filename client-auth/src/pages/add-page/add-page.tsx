import { useNavigate } from 'react-router-dom';

import ContentWrapper from '../../components/content-wrapper';
import EditForm from '../../components/edit-form/edit-form';
import type { FormPayload } from '../../components/edit-form/edit-form-payload';
import { useCreateNoteMutation } from '../../store';
import { toaster } from '../../main';

import style from './add-page.module.css';

export default function AddPage() {
  const navigate = useNavigate();
  const [createNote] = useCreateNoteMutation();

  const onSubmit = async (formData: FormPayload) => {
    try {
      await createNote(formData);
      navigate('/');
    } catch {
      toaster.add({ name: 'create-note-error', title: 'Не удалось создать заметку', theme: 'danger' });
    }
  };
  return (
    <ContentWrapper>
      <div className={style.container}>
        <EditForm
          title="Addition"
          action={onSubmit}
        />
      </div>
    </ContentWrapper>
  );
};
