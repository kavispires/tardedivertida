// Hooks
import { useCloverState } from './utils/useCloverState';
// Components
import { VIPNextPhaseButton } from 'components/vip';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { Clover } from './components/Clover';
import { PlayersGuesses } from './components/PlayersGuesses';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  round: GameRound;
  clover: Clover;
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

      <VIPNextPhaseButton round={round}>
        <Translate pt="Próximo Trevo ou Game Over" en="Next Clover or Game Over" />
      </VIPNextPhaseButton>
    </StepRankingWrapper>
  );
}
