// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FestaJuninaCard, ResolutionLog } from '../utils/types';
import { CardHighlight } from './Highlights';

type CardResolutionRuleInstructionProps = {
  players: GamePlayers;
  logEntry: ResolutionLog;
  cardsDict: Dictionary<FestaJuninaCard>;
};

export function CardResolutionRuleInstruction({
  players,
  logEntry,
  cardsDict,
}: CardResolutionRuleInstructionProps) {
  if (!logEntry.playedCardId) {
    return null;
  }

  const playedCard = cardsDict[logEntry.playedCardId];
  const actor = players[logEntry.actorPlayerId];

  return (
    <RuleInstruction type="event">
      <Translate
        en="{player} played {card}!"
        pt="{player} jogou {card}!"
        values={{
          player: <PlayerAvatarName player={actor} />,
          card: <CardHighlight color={playedCard.color}>{playedCard.name}</CardHighlight>,
        }}
      />
    </RuleInstruction>
  );
}
