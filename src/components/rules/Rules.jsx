import React, { useEffect } from 'react';
// Design Resources
import { Button, Layout, Space, Typography } from 'antd';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
// State
import { GAME_API } from '../../adapters';
import { useLoading, useIsUserReady, useAPICall, useLanguage } from '../../hooks';
// Components
import { RulesCarousel } from './index';
import { LoadingPage } from '../loaders';
import { ReadyPlayersBar, Translate, translate } from '../shared';
import { isDevEnv } from '../../utils';

export function Rules({ players, info }) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const isUserReady = useIsUserReady(players);

  const onBeReady = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar continuar',
      'Oh no! The application found an error when trying to continue',
      language
    ),
  });

  const onBeReadyQue = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate(
      'Vixi, se fudeu então, porque o jogo vai começar!',
      'Sorry, you are screwed because the game is starting anyway!',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar continuar',
      'Oh no! The application found an error when trying to continue',
      language
    ),
  });

  // DEV: Auto-ready
  useEffect(() => {
    if (isDevEnv) {
      onBeReady({});
    }
  }, []); // eslint-disable-line

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="rules">
      <Typography.Title className="center">
        <Translate pt="Regras do Jogo" en="Game Rules" />
      </Typography.Title>

      <RulesCarousel info={info} className="rules__carousel" ruleClass="rules__rule" />

      <Space className="rules__actions">
        <Button
          type="primary"
          icon={isUserReady ? <CheckCircleFilled /> : <SmileFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReady({})}
          loading={isLoading}
        >
          <Translate
            pt="Entendi tudo e estou pronto para jogar!"
            en="I understood everything and I'm ready to play!"
          />
        </Button>
        <Button
          icon={isUserReady ? <CheckCircleFilled /> : <MehFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReady({})}
          loading={isLoading}
        >
          <Translate pt="Não entendi nada, mas vamos lá!" en="I don't get it but let's go!" />
        </Button>
        <Button
          type="primary"
          danger
          icon={isUserReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReadyQue({})}
          loading={isLoading}
        >
          <Translate pt="Quê?" en="What?" />
        </Button>
      </Space>
      <ReadyPlayersBar players={players} showNames />
    </Layout.Content>
  );
}
