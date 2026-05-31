import ContentWrapper from '../../components/ContentWrapper';
import Form from '../../components/form/form';

import style from './editor-page.module.css';

export default function EditorPage() {
  return (
    <ContentWrapper>
      <div className={style.container}>
        <Form />
      </div>
    </ContentWrapper>
  );
};
