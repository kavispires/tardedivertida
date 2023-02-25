// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { FloatingHand, ImageCardHand } from 'components/cards';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';

type StepSecretClueWaitingProps = {
  leader: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: PlayerId[];
};

export function StepSecretClueWaiting({ leader, user, players, turnOrder }: StepSecretClueWaitingProps) {
  return (
    <Step fullWidth>
      <Title>
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />{' '}
        <Translate pt="Aguarde..." en="Please wait..." />
      </Title>

      <Instruction contained>
        <AvatarName player={leader} addressUser />{' '}
        <Translate pt="está escrevendo a pista secreta." en="is writing the secret clue." />
        <br />
        <Translate
          pt="Enquanto isso, examine suas cartas! Você as usará durante esta rodada."
          en="In the meantime, examine your cards. You're gonna use them this turn."
        />
      </Instruction>

      <TurnOrder players={players} activePlayerId={leader.id} order={turnOrder} />

      <FloatingHand>
        <ImageCardHand hand={user.hand} sizeRatio={6} />
      </FloatingHand>
    </Step>
  );
}
