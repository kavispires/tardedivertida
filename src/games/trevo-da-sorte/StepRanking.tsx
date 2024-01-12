// Types
import type { GamePlayers } from 'types/player';
import type { GameRanking, GameRound } from 'types/game';
import type { CloverObject, Leaves } from './utils/types';
// Hooks
import { useCloverState } from './utils/useCloverState';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Clover } from './components/Clover';
import { PlayersGuesses } from './components/PlayersGuesses';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  clover: CloverObject;
  leaves: Leaves;
  activeCloverId: PlayerId;
};

export function StepRanking({ players, ranking, round, clover, leaves, activeCloverId }: StepRankingProps) {
  const { mode, rotation, onRotateClover } = useCloverState('view', clover, leaves);

  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Pontos por encontrar só um jogador" en="Points for matching only 1 player" />,
        <Translate pt="Pontos por encontrar mais de um jogador" en="Points for matching with more players" />,
        <Translate
          pt="Pontos perdidos por não ter dado match e estar em um pesadelo"
          en="Points lost for not matching any player while in a nightmare"
        />,
      ]}
    >
      <Clover mode={mode} clover={clover} leaves={leaves} onRotate={onRotateClover} rotation={rotation} />

      <PlayersGuesses
        players={players}
        clover={clover}
        leaves={leaves}
        onRotate={onRotateClover}
        rotation={rotation}
        activeCloverId={activeCloverId}
      />

      <HostNextPhaseButton round={round}>
        <Translate pt="Próximo Trevo ou Game Over" en="Next Clover or Game Over" />
      </HostNextPhaseButton>
    </StepRankingWrapper>
  );
}
