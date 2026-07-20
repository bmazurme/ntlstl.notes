import { Button, Text } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

import ContentWrapper from '../../components/content-wrapper';
import PageMeta from '../../components/page-meta';

function OauthErrorPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta title="Доступ запрещён" noindex />
      <ContentWrapper
        children={(
          <section className="error">
            <Text variant="header-2">403</Text>
            <Text variant="header-1">Пользователь не найден</Text>
            <Text variant="body-3" color="secondary">
              Ваш аккаунт не зарегистрирован в системе. Обратитесь к администратору.
            </Text>
            <Button
              view="outlined-action"
              size="m"
              onClick={() => navigate('/oauth')}
            >
              Вернуться к входу
            </Button>
          </section>
        )}
      />
    </>
  );
}

export default OauthErrorPage;
