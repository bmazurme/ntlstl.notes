import { useParams } from 'react-router-dom';

import ContentWrapper from '../components/ContentWrapper';

function PostPage() {
  const { noteId } = useParams();

  return (
    <ContentWrapper children={(
      <section className="post">
        <div className="post-title">
          {noteId} = 
          Установка и настройка NGINX NTLM-модуля
        </div>
        <div className="post-excerpt">
          NGINX NTLM-модуль — это дополнительный модуль для веб-сервера Nginx,
          который позволяет реализовать аутентификацию по протоколу NTLM.
          Это особенно полезно при работе с корпоративными сетями и Active Directory.
        </div>
        <div className="post-meta">
          post-meta
        </div>
      </section>)}
      sidebar
    />
  )
}

export default PostPage;
