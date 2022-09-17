// Components
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Brackets } from './components/Brackets';
import { TierTitle } from './components/TierTitle';
import { Challenge } from './components/Challenge';
import { Voting } from './components/Voting';
import { BetsFloatingHand } from './components/BetsFloatingHand';
import { ReadyPlayersBar } from 'components/players';

type StepBattleProps = {
  onSubmitVotes: GenericFunction;
  challenge: TextCard;
  brackets: WBracket[];
  tier: WBracketTier;
  bets: WBets;
  selectedContenderId: CardId;
  players: GamePlayers;
};

export function StepBattle({
  onSubmitVotes,
  challenge,
  brackets,
  tier,
  bets,
  selectedContenderId,
  players,
}: StepBattleProps) {
  return (
    <Step fullWidth>
      <Title size="medium">
        <TierTitle tier={tier} />
      </Title>

      <Challenge challenge={challenge} />

      <Voting brackets={brackets} tier={tier} onSubmitVotes={onSubmitVotes} players={players} bets={bets} />

      <Brackets brackets={brackets} activeTier={tier} players={players} />

      <ReadyPlayersBar players={players} />

      <BetsFloatingHand bets={bets} brackets={brackets} selectedContenderId={selectedContenderId} />
    </Step>
  );
}
