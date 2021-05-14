import React, { useCallback } from 'react';
// Design Resources
import { Button, Layout, message, notification, Space, Typography } from 'antd';
// State
import { useGlobalState, useAmIReady } from '../../hooks';
// Components
import RulesCarousel from './RulesCarousel';
import LoadingPage from '../loaders/LoadingPage';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
import { useLoading } from '../../hooks';
import { getAPI } from '../../adapters';
import ReadyPlayersBar from '../shared/ReadyPlayersBar';

function Rules({ players, info }) {
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const amIReady = useAmIReady(players);

  const onBeReady = useCallback(async () => {
    try {
      setLoader('be-ready', true);
      const response = await getAPI(gameName).makeMeReady({
        gameId,
        gameName,
        playerName: me,
      });
      if (response.data) {
        message.success('Pronto! Aguarde os outros jogadores estarem prontos');
      }
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar continuar',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('be-ready', false);
    }
  }, [gameId, gameName, setLoader, me]);

  const onBeReadyQue = useCallback(() => {
    message.warning('Vixi, se fudeu então, pq o jogo vai começar!');
    onBeReady();
  }, [onBeReady]);

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
          onClick={onBeReady}
        >
          Entendi tudo e estou pronto para jogar!
        </Button>
        <Button
          icon={amIReady ? <CheckCircleFilled /> : <MehFilled />}
          disabled={isLoading || amIReady}
          onClick={onBeReady}
        >
          Não entendi nada, mas vamos lá
        </Button>
        <Button
          type="primary"
          danger
          icon={amIReady ? <CheckCircleFilled /> : <RobotFilled />}
          disabled={isLoading || amIReady}
          onClick={onBeReadyQue}
        >
          Que?
        </Button>
      </Space>
      <ReadyPlayersBar players={players} />
    </Layout.Content>
  );
}

export default Rules;
