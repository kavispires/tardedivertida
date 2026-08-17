// Types
import type { GameRound, GameRanking, GamePlayers } from 'types/game';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { RoundsLeftInstruction } from '@components/results/RoundsLeftInstruction';
import { StepRankingWrapper } from '@components/results/StepRankingWrapper';
// Internal
import type { Bracket } from './utils/type';
import { Brackets } from './components/Brackets';
import { PlayersBets } from './components/PlayersBets';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  isGameOver: boolean;
  round: GameRound;
  brackets: Bracket[];
};

export function StepRanking({ players, ranking, isGameOver, round, brackets }: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate
          key="1"
          pt="Apostou na final corretamente"
          en="Correct final bet"
        />,
        <Translate
          key="2"
          pt="Apostou nas semifinais corretamente"
          en="Correct semifinal bet"
        />,
        <Translate
          key="3"
          pt="Apostou nas quartas de finais corretamente"
          en="Correct quarterfinal bet"
        />,
        <Translate
          key="4"
          pt="Seu competidor ganhou"
          en="Your competitor won"
        />,
      ]}
    >
      {!isGameOver && <RoundsLeftInstruction round={round} />}

      <PlayersBets
        players={players}
        brackets={brackets}
      />

      <HostNextPhaseButton round={round} />

      <Brackets
        brackets={brackets}
        activeTier="winner"
        players={players}
      />
    </StepRankingWrapper>
  );
}
