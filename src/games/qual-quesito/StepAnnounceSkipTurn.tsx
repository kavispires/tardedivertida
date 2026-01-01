// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import { ItemsHand } from './components/ItemsHand';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';
// Hooks

type StepAnnounceSkipTurnProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<Item>;
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
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt={
            <>
              <PlayerAvatarName player={creator} /> decidiu pular a vez dele(a).
            </>
          }
          en={
            <>
              <PlayerAvatarName player={creator} /> decided to skip their turn.
            </>
          }
        />
      </StepTitle>

      <HostNextPhaseButton round={round} autoTriggerTime={10} withWaitingTimeBar />

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Quando o criador decide pular a vez, ele(a) não cria uma categoria nesta rodada e ainda ganha
              uma coisa nova.
            </>
          }
          en={
            <>
              The creator decided to skip their turn. They will not create a category this round and will
              receive a new thing.
            </>
          }
        />
      </RuleInstruction>

      <ItemsHand hand={user.hand ?? []} cardsDict={cardsDict} />

      <PlayersHandsCounts players={players} turnOrder={turnOrder} />
    </Step>
  );
}
