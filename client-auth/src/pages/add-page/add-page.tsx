import ContentWrapper from '../../components/ContentWrapper';
import EditForm from '../../components/edit-form/edit-form';
import type { FormPayload } from '../../components/edit-form/edit-form-payload';
import { useCreateNoteMutation } from '../../store';

import style from './add-page.module.css';

export default function AddPage() {
  const [createNote] = useCreateNoteMutation();

  const onSubmit = async (formData: FormPayload) => {
    try {
      await createNote(formData);
    } catch {
      console.log('err');
    }
  };
  return (
    <ContentWrapper>
      <div className={style.container}>
        <EditForm action={onSubmit} />
      </div>
    </ContentWrapper>
  );
};
