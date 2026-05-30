// import type { MarkupString } from '@gravity-ui/markdown-editor';

import type { MarkupString } from '@gravity-ui/markdown-editor';
import ContentWrapper from '../../components/ContentWrapper';
import Form from '../../components/Form/Form';
import { useCreateNoteMutation } from '../../store/api/notes-api/endpoints';

import style from './EditorPage.module.css';

const EditorPage = () => {
  const [createNote] = useCreateNoteMutation();
  const setTitle = () => { console.log('setTitle')};
  const handleSubmit = async (preview: MarkupString, content: MarkupString) => {
    try {
      await createNote({ title: 'test', preview, content, type: { id: 1 }});
    } catch {
      console.log('err');
    }
  };

  return (
    <ContentWrapper>
      <div className={style.container}>
        <Form
          title={'title'}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
        />
      </div>
    </ContentWrapper>
  );
};

export default EditorPage;
