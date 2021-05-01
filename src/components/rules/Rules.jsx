import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Button, Layout, message, notification, Space, Typography } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Utils
import gameList from '../../resources/games.json';
// Components
import RulesCarousel from './RulesCarousel';
import LoadingPage from '../loaders/LoadingPage';
import { CheckCircleFilled, MehFilled, RobotFilled, SmileFilled } from '@ant-design/icons';
import { useLoading } from '../../hooks';
import { GAME_API } from '../../adapters';

function Rules({ players, info }) {
  const [isLoading, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [amIReady, setImReady] = useState(false);

  useEffect(() => {
    if (!amIReady) {
      console.log('changed amIready');
      const ready = players?.[me]?.ready;
      setImReady(ready);
      if (ready) {
        message.success('Pronto! Aguarde os outros jogadores estarem prontos');
      }
    }
  }, [players, me]); // eslint-disable-line

  console.log({ pronto: players?.[me]?.ready });

  const onBeReady = useCallback(async () => {
    try {
      setLoader('be-ready', true);
      // const response = await GAME_API.makeMeReady({
      //   gameId,
      //   gameName,
      //   playerName: me,
      // });
      // if (response.data) {
      setImReady(true);
      message.success('Pronto! Aguarde os outros jogadores estarem prontos');
      // }
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
    </Layout.Content>
  );
}

export default Rules;
