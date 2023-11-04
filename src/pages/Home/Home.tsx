import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTitle } from 'react-use';
// Ant Design Resources
import { Button, Image, Input, Layout, Space } from 'antd';
import { ForwardFilled } from '@ant-design/icons';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { resetGlobalState } from 'hooks/useGlobalState';
// Assets
import logo from 'assets/images/tarde-divertida-logo.svg';
// Components
import { Translate } from 'components/language';
import { useLanguage } from 'hooks/useLanguage';

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
    <Layout className="home">
      <div className="home__logo-container">
        <Image
          src={logo}
          className="home__logo"
          preview={false}
          alt="Tarde Divertida logo"
          onClick={() => setShowInput(!showInput)}
        />

        <Space className={clsx('home__input', showInput && 'home__input--visible')} direction="vertical">
          <Space className="space-container">
            <Input
              size="large"
              disabled={!showInput}
              placeholder="GAME ID"
              maxLength={4}
              onPressEnter={goToGameId}
              onChange={(e) => setGameId(e.target.value)}
            />
            <Button size="large" type="primary" onClick={goToGameId}>
              <ForwardFilled />
            </Button>
          </Space>

          <Space.Compact className="space-container">
            {isAuthenticated && (
              <>
                <Button ghost onClick={() => navigate(language === 'pt' ? '/eu' : '/me')}>
                  <Translate pt="Página de Usuário" en="User page" />
                </Button>
                <Button ghost onClick={() => navigate('/daily')}>
                  <Translate pt="Desafio Diário" en="Daily Challenge" />
                </Button>
              </>
            )}
            {isAuthenticated && isAdmin && (
              <Button type="primary" danger onClick={() => navigate('/hub')}>
                HUB
              </Button>
            )}
          </Space.Compact>
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
    </Layout>
  );
}

export default Home;
