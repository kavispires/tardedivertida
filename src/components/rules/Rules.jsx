import React from 'react';
// Design Resources
import { Button, Layout, Space, Typography } from 'antd';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
// State
import { GAME_API } from '../../adapters';
import { useLoading, useIsUserReady, useAPICall } from '../../hooks';
// Components
import { RulesCarousel } from './index';
import { LoadingPage } from '../loaders';
import { ReadyPlayersBar } from '../shared';

export function Rules({ players, info }) {
  const [isLoading] = useLoading();
  const isUserReady = useIsUserReady(players);

  const onBeReady = useAPICall({
    apiFunction: GAME_API.makeMeReady,
    actionName: 'be-ready',
    successMessage: 'Pronto! Aguarde os outros jogadores estarem prontos',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar continuar',
  });

  const onBeReadyQue = useAPICall({
    apiFunction: GAME_API.makeMeReady,
    actionName: 'be-ready',
    successMessage: 'Vixi, se fudeu então, pq o jogo vai começar!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar continuar',
  });

  if (!info?.gameName) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="rules">
      <Typography.Title className="center">Regras do Jogo</Typography.Title>

      <RulesCarousel info={info} className="rules__carousel" ruleClass="rules__rule" />

      <Space className="rules__actions">
        <Button
          type="primary"
          icon={isUserReady ? <CheckCircleFilled /> : <SmileFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReady({})}
        >
          Entendi tudo e estou pronto para jogar!
        </Button>
        <Button
          icon={isUserReady ? <CheckCircleFilled /> : <MehFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReady({})}
        >
          Não entendi nada, mas vamos lá
        </Button>
        <Button
          type="primary"
          danger
          icon={isUserReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || isUserReady}
          onClick={() => onBeReadyQue({})}
        >
          Que?
        </Button>
      </Space>
      <ReadyPlayersBar players={players} showNames />
    </Layout.Content>
  );
}
