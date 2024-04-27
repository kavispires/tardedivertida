import './ConnectTrio.scss';

import { Button, Layout, Modal, Space, Typography } from 'antd';
import clsx from 'clsx';
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { PageError } from 'components/errors';
import { Translate } from 'components/language';
import { Loading } from 'components/loaders';
import { useCardWidth } from 'hooks/useCardWidth';
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { useLanguage } from 'hooks/useLanguage';
import { PlayerIconsIcon } from 'icons/PlayerIconsIcon';
import { Menu } from 'pages/Daily/games/ConnectTrio/Menu';
import { LoginModal } from 'pages/Me/components/LoginModal';
import { ReactNode, useEffect } from 'react';
import { useTitle } from 'react-use';

import { useConnectTrioEngine, useConnectTrioGame } from './hooks';
import { ResultsModalContent } from './ResultsModalContent';
import { ConnectionGame } from './types';
import { getAnimationClass } from 'utils/helpers';

const { Header, Content } = Layout;

type ConnectTrioGameProps = {
  game: ConnectionGame;
  createNewGame: () => void;
};

function ConnectTrioGame({ game, createNewGame }: ConnectTrioGameProps) {
  const {
    hearts,
    items,
    correctGroups,
    selection,
    previousSelection,
    onShuffle,
    onSelect,
    onSubmit,
    onDeselectAll,
    outcome,
    resultPrint,
    isComplete,
    showResultModal,
    disabled,
    setShowResultModal,
  } = useConnectTrioEngine(game);
  const cardWidth = useCardWidth(3, { maxWidth: 100, minWidth: 80 });

  return (
    <>
      <Menu userDaily={{ total: 0, longestStreak: 0, streak: 0 }} hearts={hearts} openRules={true} />

      <Space className="space-container" direction="vertical">
        <Typography.Title level={2} className="connect-trio-heading">
          <Translate pt="Faça grupos de três" en="Create groups of three" />
        </Typography.Title>

        <div className="connect-trio-container">
          {correctGroups.map((correctGroup) => (
            <div
              key={correctGroup.groupId}
              className={clsx(
                'connect-trio-group-container',
                outcome === 'CORRECT' && getAnimationClass('fadeIn')
              )}
            >
              <span className="connect-trip-group-name">{correctGroup.name}</span>
              <div className="connect-trio-item-container">
                {correctGroup.items.map((item) => (
                  <ItemCard
                    key={item}
                    id={item}
                    width={cardWidth}
                    className={clsx(`item--${game.itemsDict[item].color}`)}
                  />
                ))}
              </div>
            </div>
          ))}
          {!disabled && (
            <div className="connect-trio-item-container">
              {items.map((item) => {
                const isActive = selection.includes(item);
                return (
                  <TransparentButton
                    key={item}
                    onClick={() => onSelect(item)}
                    active={isActive}
                    activeClass="item-button-active-override"
                    disabled={disabled}
                  >
                    <ItemCard
                      id={item}
                      width={cardWidth}
                      className={clsx(
                        isActive && 'item--active',
                        outcome === 'WRONG' && previousSelection.includes(item) && getAnimationClass('shakeX')
                      )}
                    />
                  </TransparentButton>
                );
              })}
            </div>
          )}
        </div>

        <Space className="space-container">
          <Button onClick={onShuffle} shape="round" disabled={disabled}>
            <Translate pt="Embaralhar" en="Shuffle" />
          </Button>
          <Button
            onClick={onDeselectAll}
            type="dashed"
            shape="round"
            disabled={selection.length === 0 || disabled}
          >
            <Translate pt="Limpar" en="Clear" />
          </Button>
          <Button onClick={onSubmit} type="primary" shape="round" disabled={selection.length < 3 || disabled}>
            <Translate pt="Enviar" en="Submit" />
          </Button>
        </Space>

        {disabled && (
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary">
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
            <Button onClick={createNewGame}>
              <Translate pt="Gerar Novo Desafio" en="GenerateNew Challenge" />
            </Button>
          </Space>
        )}
        <Modal
          title={<Translate pt="Resultado" en="Results" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          <ResultsModalContent
            game={game}
            win={isComplete}
            hearts={hearts}
            resultPrint={resultPrint}
            correctGroups={correctGroups}
          />
        </Modal>
      </Space>
    </>
  );
}

function ConnectTrioDataWrapper() {
  const { translate } = useLanguage();

  const { isLoading, isError, game, failToCreate, createNewGame } = useConnectTrioGame();

  if (isLoading) {
    return (
      <ConnectTrioChrome>
        <Space className="space-container">
          <Loading message={translate('Carregando desafio', 'Loading challenge')} margin />
        </Space>
      </ConnectTrioChrome>
    );
  }

  if (isError || !game || failToCreate) {
    return (
      <ConnectTrioChrome>
        <PageError />
      </ConnectTrioChrome>
    );
  }

  return (
    <ConnectTrioChrome>
      <ConnectTrioGame game={game} createNewGame={createNewGame} />
    </ConnectTrioChrome>
  );
}

function ConnectTrioPage() {
  const { isAuthenticated } = useCurrentUserContext();

  if (!isAuthenticated) {
    return (
      <ConnectTrioChrome>
        <LoginModal isAuthenticated={false} />
      </ConnectTrioChrome>
    );
  }

  return <ConnectTrioDataWrapper />;
}

type ConnectTrioChromeProps = {
  challenge?: ReactNode;
  children: ReactNode;
};

function ConnectTrioChrome({ challenge, children }: ConnectTrioChromeProps) {
  const { translate, setLanguage } = useLanguage();
  useEffect(() => {
    setLanguage('pt');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useTitle(translate('Conexões Triplas | Tarde Divertida', 'Connect Trio | Tarde Divertida'));

  return (
    <Layout className="app">
      <Header className="daily-header">
        <IconAvatar icon={<PlayerIconsIcon />} />
        <Typography.Title level={1} className="daily-heading">
          TD <Translate pt="Conexões Triplas" en="Connect Trio" /> #{challenge ?? 0}
        </Typography.Title>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
}

export default ConnectTrioPage;
