import { ArrowLeft } from '@gravity-ui/icons';
import { Button, Icon, Text } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';

import ContentWrapper from '../../components/content-wrapper';
import PageMeta from '../../components/page-meta';
import { useTheme } from '../../hooks/use-theme';
import { VITE_TOKEN } from '../../utils/constants';

import style from './oauth-page.module.css';

const OauthPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const oauthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${VITE_TOKEN}`;

  return (
    <ContentWrapper>
      <PageMeta
        title="Вход"
        description="Войдите через Яндекс ID"
      />
      <div className={style.container}>
        <Button
          view="flat"
          size="s"
          aria-label="Назад"
          onClick={() => navigate(-1)}
        >
          <Icon
            data={ArrowLeft}
            size={14}
            aria-hidden="true"
          />
          Назад
        </Button>

        <div className={style.header}>
          <Text variant="display-1">NTLSTL</Text>
          <Text
            variant="body-2"
            color="secondary"
          >
            Войдите, чтобы продолжить
          </Text>
        </div>

        <a
          href={oauthUrl}
          className={style.yandexButton}
          aria-label="Войти с Яндекс ID"
        >
          <img
            src={isDark ? '/ya-oauth.svg' : '/ya-oauth-white.svg'}
            alt="Войти с Яндекс ID"
            width="135"
            height="44"
            className={style.yandexLogo}
          />
        </a>
      </div>
    </ContentWrapper>
  );
};

export default OauthPage;
