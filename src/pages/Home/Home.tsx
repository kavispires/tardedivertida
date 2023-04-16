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

function Home() {
  useTitle('Tarde Divertida');
  const { isAdmin, isAuthenticated } = useCurrentUserContext();

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

        <Space className={clsx('home__input', showInput && 'home__input--visible')}>
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
          {isAdmin && (
            <Button size="large" type="primary" danger onClick={() => navigate('/hub')}>
              HUB
            </Button>
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
    </Layout>
  );
}

export default Home;
