import PropTypes from 'prop-types';
import { AvatarName } from '../../components/avatars';
import { Translate, WaitingRoom } from '../../components/shared';

function StepClueWaiting({ players, psychic }) {
  return (
    <WaitingRoom
      players={players}
      title={<Translate pt={'Concentração...'} en={'Focus...'} />}
      instruction=""
    >
      <p>
        <AvatarName player={psychic} />
        <Translate
          pt={
            'escolherá uma carta com duas ideias opostas, e então terá que escrever uma dica que ajude você e os outros jogadores a escolher a posição correta do ponteiro no medidor de ondas telepáticas.'
          }
          en={
            'is choosing a card with two opposing ideas, then they will write a clue that will help you and the other players to find the correct position of the needle in the Wavelength measuring device...'
          }
        />
      </p>
    </WaitingRoom>
  );
}

StepClueWaiting.propTypes = {
  players: PropTypes.object,
  psychic: PropTypes.object,
};

export default StepClueWaiting;
