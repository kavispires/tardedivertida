// Components
import {
  AvatarIcon,
  AvatarName,
  FloatingHand,
  ImageCardHand,
  Instruction,
  Title,
  Translate,
  TurnOrder,
} from 'components';

type StepSecretClueWaitingProps = {
  leader: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  turnOrder: PlayerId[];
};

export function StepSecretClueWaiting({ leader, user, players, turnOrder }: StepSecretClueWaitingProps) {
  return (
    <div className="d-secret-clue-write">
      <Title>
        <AvatarIcon type="animated-clock" size="large" /> <Translate pt="Aguarde..." en="Please wait..." />
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
    </div>
  );
}
