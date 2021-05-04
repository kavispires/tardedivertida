import React, { useCallback } from 'react';
// Design Resources
import { Button, Layout, message, notification, Typography } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Components
import LoadingPage from '../loaders/LoadingPage';
import { ARTE_RUIM_API } from '../../adapters';
import { RocketFilled } from '@ant-design/icons';
import RankingBoard from './RankingBoard';
import { ARTE_RUIM_PHASES } from '../../utils/constants';
import PhaseContainer from '../global/PhaseContainer';

function RankingPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [isAdmin] = useGlobalState('isAdmin');

  const onGoToRankingPhase = useCallback(async () => {
    try {
      setLoader('go-to-next-round', true);

      const response = await ARTE_RUIM_API.goToNextPhase({
        gameId,
        gameName,
        playerName: me,
      });
      if (response.data) {
        message.success('Ranking!');
      }
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a proxima rodada',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('go-to-next-round', false);
    }
  }, [gameId, gameName, me, setLoader]);

  return (
    <PhaseContainer
      info={info?.gameName}
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.RANKING}
      className="ranking-phase"
    >
      <Typography.Title className="center">Ranking</Typography.Title>
      <RankingBoard players={players} ranking={state.ranking} />
      {isAdmin && (
        <Button icon={<RocketFilled />} danger type="primary" onClick={onGoToRankingPhase}>
          Ir para o próximo jogo ou trancar esse se tiver acabado
        </Button>
      )}
    </PhaseContainer>
  );
}

export default RankingPhase;
