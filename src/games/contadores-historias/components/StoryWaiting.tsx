// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { TableOrder } from 'components/players/TableOrder';
import { Step, type StepProps } from 'components/steps';
import { Instruction, Title } from 'components/text';
// Type

type StoryWaitingProps = {
  storyteller: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  gameOrder: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StoryWaiting({ storyteller, user, players, gameOrder, announcement }: StoryWaitingProps) {
  return (
    <Step fullWidth className="c-story-waiting" announcement={announcement}>
      <Title>
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />{' '}
        <Translate pt="Aguarde..." en="Please wait..." />
      </Title>
      <Instruction contained>
        <AvatarName player={storyteller} addressUser />{' '}
        <Translate
          pt="está escrevendo uma história para essa rodada."
          en="is writing a story for this round."
        />
        <br />
        <Translate
          pt="Enquanto isso, examine suas cartas! Você as usará durante esta rodada."
          en="In the meantime, examine your cards. You're gonna use them this round."
        />
      </Instruction>

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
