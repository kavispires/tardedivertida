import React from 'react';
// Design Resources
import { Button, Layout, Space, Typography } from 'antd';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
// State
import { GAME_API } from '../../adapters';
import { useLoading, useAmIReady, useAPICall } from '../../hooks';
// Components
import RulesCarousel from './RulesCarousel';
import LoadingPage from '../loaders/LoadingPage';
import ReadyPlayersBar from '../shared/ReadyPlayersBar';

function Rules({ players, info }) {
  const [isLoading] = useLoading();
  const amIReady = useAmIReady(players);

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
          icon={amIReady ? <CheckCircleFilled /> : <SmileFilled />}
          disabled={isLoading || amIReady}
          onClick={() => onBeReady({})}
        >
          Entendi tudo e estou pronto para jogar!
        </Button>
        <Button
          icon={amIReady ? <CheckCircleFilled /> : <MehFilled />}
          disabled={isLoading || amIReady}
          onClick={() => onBeReady({})}
        >
          Não entendi nada, mas vamos lá
        </Button>
        <Button
          type="primary"
          danger
          icon={amIReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || amIReady}
          onClick={() => onBeReadyQue({})}
        >
          Que?
        </Button>
      </Space>
      <ReadyPlayersBar players={players} showNames />
    </Layout.Content>
  );
}

export default Rules;
