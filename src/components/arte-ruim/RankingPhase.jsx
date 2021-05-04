import React, { useCallback } from 'react';
// Design Resources
import { Button, message, notification, Typography } from 'antd';
import { RocketFilled } from '@ant-design/icons';
// State & Hooks
import useGlobalState from '../../hooks/useGlobalState';
import { useLoading } from '../../hooks';
// Resources and Utils
import { ARTE_RUIM_API } from '../../adapters';
import { ARTE_RUIM_PHASES } from '../../utils/constants';
// Components
import PhaseContainer from '../shared/PhaseContainer';
import AdminOnly from '../shared/AdminOnly';
import RankingBoard from '../shared/RankingBoard';

function RankingPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');

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
      info={info}
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.RANKING}
      className="ranking-phase"
    >
      <Typography.Title className="center">
        {state.pointsToVictory >= 0 ? 'Ranking' : 'Game Over'}
      </Typography.Title>
      <RankingBoard players={players} ranking={state.ranking} />
      <AdminOnly>
        <Button icon={<RocketFilled />} danger type="primary" onClick={onGoToRankingPhase}>
          Ir para o próximo jogo ou trancar esse se tiver acabado
        </Button>
      </AdminOnly>
    </PhaseContainer>
  );
}

export default RankingPhase;
