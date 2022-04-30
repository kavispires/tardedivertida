import { Image, Input, Layout } from 'antd';
import logo from 'assets/images/tarde-divertida-logo.svg';
import clsx from 'clsx';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const goToGameId = (e: PlainObject) => {
    const gameId = e.target.value;
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

        <div className={clsx('home__input', showInput && 'home__input--visible')}>
          <Input
            size="large"
            disabled={!showInput}
            placeholder="GAME ID"
            maxLength={4}
            onPressEnter={goToGameId}
          />
        </div>
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
