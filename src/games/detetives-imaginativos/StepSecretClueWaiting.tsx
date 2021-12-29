// Design Resources
import { Avatar } from 'antd';
// Components
import { AvatarName, Icons, ImageCardHand, Instruction, Title, Translate } from '../../components';

type StepSecretClueWaitingProps = {
  leader: GamePlayer;
  user: GamePlayer;
};

function StepSecretClueWaiting({ leader, user }: StepSecretClueWaitingProps) {
  return (
    <div className="d-secret-clue-write">
      <Title>
        <Avatar src={<Icons.AnimatedClock />} size="large" />{' '}
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
      <ImageCardHand hand={user.hand} sizeRatio={6} />
    </div>
  );
}

export default StepSecretClueWaiting;
