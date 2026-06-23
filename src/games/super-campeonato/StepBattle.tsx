// Types
import type { GamePlayers } from 'types/game';
import type { TextCard } from 'types/tdr';
// Components
import { ReadyPlayersBar } from '@components/players/ReadyPlayersBar';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Bet, Bracket, BracketTier, SubmitBattleVotesPayload } from './utils/type';
import { Brackets } from './components/Brackets';
import { TierTitle } from './components/TierTitle';
import { Challenge } from './components/Challenge';
import { Voting } from './components/Voting';
import { BetsFloatingHand } from './components/BetsFloatingHand';

type StepBattleProps = {
  onSubmitVotes: (payload: SubmitBattleVotesPayload) => void;
  challenge: TextCard;
  brackets: Bracket[];
  tier: BracketTier;
  bets: Bet;
  selectedContenderIds: UID[];
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

export function StepBattle({
  onSubmitVotes,
  challenge,
  brackets,
  tier,
  bets,
  selectedContenderIds,
  players,
  announcement,
}: StepBattleProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <TierTitle tier={tier} />
      </StepTitle>

      <Challenge challenge={challenge} />

      <Voting
        brackets={brackets}
        tier={tier}
        onSubmitVotes={onSubmitVotes}
        players={players}
        bets={bets}
      />

      <Brackets
        brackets={brackets}
        activeTier={tier}
        players={players}
      />

      <ReadyPlayersBar players={players} />

      <BetsFloatingHand
        bets={bets}
        brackets={brackets}
        selectedContenderIds={selectedContenderIds}
      />
    </Step>
  );
}
