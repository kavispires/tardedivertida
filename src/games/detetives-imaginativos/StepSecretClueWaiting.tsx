// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';

type StepSecretClueWaitingProps = {
  leader: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StepSecretClueWaiting({
  leader,
  user,
  players,
  turnOrder,
  announcement,
}: StepSecretClueWaitingProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle wait>
        <Translate pt="Aguarde..." en="Please wait..." />
      </StepTitle>

      <RuleInstruction type="wait">
        <PlayerAvatarName player={leader} addressUser />{' '}
        <Translate pt="está escrevendo a pista secreta." en="is writing the secret clue." />
        <br />
        <Translate
          pt="Enquanto isso, examine suas cartas! Você as usará durante esta rodada."
          en="In the meantime, examine your cards. You're gonna use them this turn."
        />
      </RuleInstruction>

      <TurnOrder players={players} activePlayerId={leader.id} order={turnOrder} reorderByUser={leader.id} />

      <FloatingHand>
        <ImageCardHand hand={user.hand} sizeRatio={user.hand?.length} />
      </FloatingHand>
    </Step>
  );
}
