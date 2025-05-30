// Types
import type { GameRound, GameRanking } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { RoundsLeftInstruction } from 'components/text';
// Internal
import type { Bet, Bracket } from './utils/type';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { Brackets } from './components/Brackets';
import { PlayersBets } from './components/PlayersBets';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  isGameOver: boolean;
  round: GameRound;
  brackets: Bracket[];
  selectedContenderId: CardId;
  bets: Bet;
};

export function StepRanking({
  players,
  ranking,
  isGameOver,
  round,
  brackets,
  bets,
  selectedContenderId,
}: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate key="1" pt="Apostou na final corretamente" en="Correct final bet" />,
        <Translate key="2" pt="Apostou nas semifinais corretamente" en="Correct semifinal bet" />,
        <Translate key="3" pt="Apostou nas quartas de finais corretamente" en="Correct quarterfinal bet" />,
        <Translate key="4" pt="Seu competidor ganhou" en="Your competitor won" />,
      ]}
    >
      {!isGameOver && <RoundsLeftInstruction round={round} />}

      <PlayersBets players={players} brackets={brackets} />

      <HostNextPhaseButton round={round} />

      <Brackets brackets={brackets} activeTier="winner" players={players} />

      <BetsFloatingHand bets={bets} brackets={brackets} selectedContenderId={selectedContenderId} />
    </StepRankingWrapper>
  );
}
