import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { useTitle } from 'react-use';
// Ant Design Resources
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Input, Space } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { resetGlobalState } from 'hooks/useGlobalState';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { AdminButton } from 'components/admin';
import { LanguageSwitch, Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Title } from 'components/text';
// Internal
import { HomeVideoBackground } from './HomeVideoBackground';
// Images
import logo from 'assets/images/tarde-divertida-logo.svg?url';
// Sass
import './Home.scss';
import clsx from 'clsx';
// Animation

const MotionImage = motion.create(Image);
const MotionSpace = motion.create(Space);
const MotionButton = motion.create(Button);

function Home() {
  useTitle('Tarde Divertida');
  const { isAuthenticated } = useCurrentUserContext();
  const { language } = useLanguage();

  const [showInput, setShowInput] = useState(isAuthenticated);
  const [gameId, setGameId] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);

  // Apply hover effect after a slight delay from the initial render
  useEffect(() => {
    if (showInput && !isMobile) {
      // Reset the state when showInput changes
      setInitialAnimationComplete(false);

      const timer = setTimeout(() => {
        setInitialAnimationComplete(true);
      }, 800); // Wait longer than the animation duration to ensure it completes
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showInput]);
  const homeInputId = useId();
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
      {!isMobileOnly && <HomeVideoBackground />}
      <div className="home__logo-container">
        <AnimatePresence>
          {!showInput && (
            <MotionImage
              src={logo}
              className="home__logo"
              preview={false}
              alt="Tarde Divertida logo"
              onClick={() => setShowInput(!showInput)}
              initial={{ opacity: isMobile ? 1 : 0.05, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: 'anticipate' }}
            />
          )}

          {showInput && (
            <MotionSpace
              id={homeInputId}
              className={clsx('home__input', {
                'home__input--hovered': isHovering && initialAnimationComplete,
                'home__input--not-hovered': !isHovering,
              })}
              align="center"
              direction="vertical"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: 'anticipate' }}
              onMouseEnter={() => {
                if (!isMobile) setIsHovering(true);
              }}
              onMouseLeave={() => {
                if (isMobile) return;
                // Only remove hover effect if gameId is empty
                if (!gameId || gameId.length === 0) setIsHovering(false);
              }}
            >
              <SpaceContainer>
                <LanguageSwitch />
              </SpaceContainer>

              <Title level={2} size="xx-small">
                <Translate pt="Digite o código do jogo" en="Enter the game code" />
              </Title>

              <SpaceContainer>
                <Input.OTP
                  length={4}
                  formatter={(str) => str.toUpperCase()}
                  onInput={(e) => setGameId(e.join(''))}
                  value={gameId}
                  size="large"
                />
              </SpaceContainer>

              <AnimatePresence>
                {gameId.length === 4 && (
                  <MotionButton
                    key="enter-button"
                    size="large"
                    type="primary"
                    onClick={goToGameId}
                    block
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Translate pt="Entrar" en="Enter" />
                  </MotionButton>
                )}
              </AnimatePresence>

              <Flex gap={8} className="home__buttons" justify="center">
                {isAuthenticated && (
                  <Button onClick={() => navigate(language === 'pt' ? '/eu' : '/me')} icon={<UserOutlined />}>
                    <Translate pt="Página de Usuário" en="User page" />
                  </Button>
                )}

                {language === 'pt' && (
                  <Button
                    onClick={() => navigate(language === 'pt' ? '/diario' : '/daily')}
                    icon={<CalendarOutlined />}
                  >
                    <Translate pt="Desafio Diário" en="Daily Challenge" />
                  </Button>
                )}

                {isAuthenticated && <AdminButton onClick={() => navigate('/hub')}>Hub</AdminButton>}
              </Flex>
            </MotionSpace>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

export default Home;
