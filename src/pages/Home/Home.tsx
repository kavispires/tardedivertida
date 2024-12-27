import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTitle } from 'react-use';
// Ant Design Resources
import { Button, Flex, Image, Input, Layout, Space } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { resetGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { AdminButton } from 'components/admin';
import { PageLayout } from 'components/general/PageLayout';
import { LanguageSwitch, Translate } from 'components/language';
import { Title } from 'components/text';
// Images
import logo from 'assets/images/tarde-divertida-logo.svg';
// Sass
import './Home.scss';

function Home() {
  useTitle('Tarde Divertida');
  const { isAdmin, isAuthenticated } = useCurrentUserContext();
  const { language } = useLanguage();

  const [showInput, setShowInput] = useState(isAuthenticated);
  const [gameId, setGameId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    resetGlobalState();
  }, []);

  const goToGameId = () => {
    if (gameId && gameId.length === 4) {
      navigate(`/${gameId.toUpperCase()}`);
    }
  };

  return (
    <PageLayout className="home">
      <div className="home__logo-container">
        <Image
          src={logo}
          className="home__logo"
          preview={false}
          alt="Tarde Divertida logo"
          onClick={() => setShowInput(!showInput)}
        />

        <Space className={clsx('home__input', showInput && getAnimationClass('fadeIn'))} direction="vertical">
          <Space className="space-container">
            <LanguageSwitch />
          </Space>

          <Title level={2} size="xx-small" colorScheme="dark">
            <Translate pt="Digite o código do jogo" en="Enter the game code" />
          </Title>

          <Space className="space-container">
            <Input.OTP
              length={4}
              formatter={(str) => str.toUpperCase()}
              onChange={(e) => setGameId(e)}
              size="large"
            />
          </Space>
          {gameId.length === 4 && (
            <Button
              size="large"
              type="primary"
              onClick={goToGameId}
              block
              className={getAnimationClass('fadeIn')}
            >
              <Translate pt="Entrar" en="Enter" />
            </Button>
          )}

          {isAuthenticated && (
            <Flex gap={8} className="home__buttons">
              <Button.Group>
                <Button ghost onClick={() => navigate(language === 'pt' ? '/eu' : '/me')}>
                  <Translate pt="Página de Usuário" en="User page" />
                </Button>
                <Button ghost onClick={() => navigate(language === 'pt' ? '/diario' : '/daily')}>
                  <Translate pt="Desafio Diário" en="Daily Challenge" />
                </Button>
              </Button.Group>

              <AdminButton ghost onClick={() => navigate('/hub')}>
                Hub
              </AdminButton>
            </Flex>
          )}
        </Space>
      </div>
      <div className="home__background">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </PageLayout>
  );
}

export default Home;
