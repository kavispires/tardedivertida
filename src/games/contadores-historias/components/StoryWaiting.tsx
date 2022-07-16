// Components
import { AvatarName } from 'components/avatars';
import { FloatingHand, ImageCardHand } from 'components/cards';
import { AnimatedClockIcon } from 'components/icons/AnimatedClockIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StoryWaitingProps = {
  storyteller: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  gameOrder: PlayerId[];
};

export function StoryWaiting({ storyteller, user, players, gameOrder }: StoryWaitingProps) {
  return (
    <Step fullWidth className="c-story-waiting">
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
      <TurnOrder players={players} activePlayerId={storyteller.id} order={gameOrder} />
      <FloatingHand>
        <ImageCardHand hand={user.hand} sizeRatio={user.hand.length} />
      </FloatingHand>
    </Step>
  );
}
