import PropTypes from 'prop-types';
// Components
import { Instruction, Title, Translate } from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import { ImageCardHand as Hand } from '../../components/cards';
import { LoadingClock } from '../../components/icons';

function SecretClueWaiting({ leader, user }) {
  return (
    <div className="d-secret-clue-write">
      <Title>
        <LoadingClock /> <Translate pt="Aguarde..." en="Please wait..." />
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
      <Hand hand={user.hand} sizeRatio={6} />
    </div>
  );
}

SecretClueWaiting.propTypes = {
  leader: PropTypes.shape({
    name: PropTypes.string,
  }),
  user: PropTypes.shape({
    hand: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default SecretClueWaiting;
