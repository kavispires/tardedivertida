// Components
import { AdminNextRoundButton } from 'components/admin';
import { Translate } from 'components/language';
import { StepRankingWrapper } from 'components/ranking';
import { RoundsLeftInstruction } from 'components/text';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { Brackets } from './components/Brackets';

type StepRankingProps = {
  players: GamePlayers;
  ranking: GameRanking;
  isGameOver: boolean;
  round: GameRound;
  isLastRound?: boolean;
  brackets: WBracket[];
  selectedContenderId: CardId;
  bets: WBets;
};

export function StepRanking({
  players,
  ranking,
  isGameOver,
  round,
  isLastRound = false,
  brackets,
  bets,
  selectedContenderId,
}: StepRankingProps) {
  return (
    <StepRankingWrapper
      players={players}
      ranking={ranking}
      gainedPointsDescriptions={[
        <Translate pt="Apostas corretos" en="Correct bets" />,
        <Translate pt="Seu competidor ganhou" en="Your competitor won" />,
      ]}
    >
      {!isGameOver && <RoundsLeftInstruction round={round} lastRound={isLastRound} />}

      <AdminNextRoundButton round={round} lastRound={isLastRound} />

      <Brackets brackets={brackets} activeTier="winner" />

      <BetsFloatingHand bets={bets} brackets={brackets} selectedContenderId={selectedContenderId} />
    </StepRankingWrapper>
  );
}
