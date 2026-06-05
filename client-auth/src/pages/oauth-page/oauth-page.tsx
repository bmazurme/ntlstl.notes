import { useNavigate } from 'react-router-dom';
import { Button, Icon, Text } from '@gravity-ui/uikit';
import { ArrowLeft } from '@gravity-ui/icons';

import ContentWrapper from '../../components/content-wrapper';
import { VITE_TOKEN } from '../../utils/constants';
import { useTheme } from '../../hooks/use-theme';

import style from './oauth-page.module.css';

const OauthPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const oauthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${VITE_TOKEN}`;

  return (
    <ContentWrapper>
      <div className={style.container}>
        <Button view="flat" size="s" onClick={() => navigate(-1)}>
          <Icon data={ArrowLeft} size={14} />
          Назад
        </Button>

        <div className={style.header}>
          <Text variant="display-1">NTLSTL</Text>
          <Text variant="body-2" color="secondary">Войдите, чтобы продолжить</Text>
        </div>

        <a href={oauthUrl} className={style.yandexButton}>
          <img
            src={isDark ? '/ya-oauth.svg' : '/ya-oauth-white.svg'}
            alt="Войти с Яндекс ID"
            className={style.yandexLogo}
          />
        </a>
      </div>
    </ContentWrapper>
  );
};

export default OauthPage;
