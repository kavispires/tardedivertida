import PropTypes from 'prop-types';
// Components
import { Instruction, Title, Translate } from '../../components/shared';
import { AvatarName } from '../../components/avatars';
import { ImageCardHand as Hand } from '../../components/cards';
import { LoadingClock } from '../../components/icons';

function StoryWaiting({ storyteller, user }) {
  return (
    <div className="c-story-waiting">
      <Title>
        <LoadingClock /> <Translate pt="Aguarde..." en="Please wait..." />
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
      <Hand hand={user.hand} sizeRatio={user.hand.length} />
    </div>
  );
}

StoryWaiting.propTypes = {
  storyteller: PropTypes.shape({
    name: PropTypes.string,
  }),
  user: PropTypes.shape({
    hand: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default StoryWaiting;
