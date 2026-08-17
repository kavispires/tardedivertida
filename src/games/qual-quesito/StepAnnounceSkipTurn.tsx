// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Components
import { HostNextPhaseButton } from '@components/host/HostNextPhaseButton';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { ItemsHand } from './components/ItemsHand';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';

type StepAnnounceSkipTurnProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<ItemData>;
  creator: GamePlayer;
  turnOrder: GameOrder;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepAnnounceSkipTurn({
  announcement,
  user,
  cardsDict,
  creator,
  players,
  turnOrder,
  round,
}: StepAnnounceSkipTurnProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="{creator} decidiu pular a vez dele(a)."
          en="{creator} decided to skip their turn."
          values={{
            creator: <PlayerAvatarName player={creator} />,
          }}
        />
      </StepTitle>

      <HostNextPhaseButton
        round={round}
        autoTriggerTime={10}
        withWaitingTimeBar
      />

      <RuleInstruction type="rule">
        <Translate
          pt="Quando o criador decide pular a vez, ele(a) não cria uma categoria nesta rodada e ainda ganha uma coisa nova."
          en="The creator decided to skip their turn. They will not create a category this round and will receive a new thing."
        />
      </RuleInstruction>

      <ItemsHand
        hand={user.hand ?? []}
        cardsDict={cardsDict}
      />

      <PlayersHandsCounts
        players={players}
        turnOrder={turnOrder}
      />
    </Step>
  );
}
