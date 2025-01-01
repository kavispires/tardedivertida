// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TableOrder } from 'components/players/TableOrder';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Icons

type StoryWaitingProps = {
  storyteller: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  gameOrder: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StoryWaiting({ storyteller, user, players, gameOrder, announcement }: StoryWaitingProps) {
  return (
    <Step fullWidth className="c-story-waiting" announcement={announcement}>
      <StepTitle wait>
        <Translate pt="Aguarde..." en="Please wait..." />
      </StepTitle>
      <RuleInstruction type="wait">
        <AvatarName player={storyteller} />{' '}
        <Translate
          pt="está escrevendo uma história para essa rodada."
          en="is writing a story for this round."
        />
        <br />
        <Translate
          pt="Enquanto isso, examine suas cartas! Você as usará durante esta rodada."
          en="In the meantime, examine your cards. You're gonna use them this round."
        />
      </RuleInstruction>

      <TableOrder
        players={players}
        activePlayerId={storyteller.id}
        order={gameOrder}
        size="small"
        reorderByUser={storyteller.id}
      />

      <FloatingHand>
        <ImageCardHand hand={user.hand} sizeRatio={user.hand?.length} />
      </FloatingHand>
    </Step>
  );
}
