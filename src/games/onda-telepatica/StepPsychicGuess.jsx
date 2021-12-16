import PropTypes from 'prop-types';
// Design Resources
import { Button } from 'antd';
// Hooks
import { useLoading } from '../../hooks';
// Components
import { ButtonContainer, Instruction, Step, Title, Translate } from '../../components/shared';
import Dial from './Dial';

function StepPsychicGuess({ currentCategory, onSendGuess }) {
  const [isLoading] = useLoading();

  return (
    <Step className="o-dial-guess-selection">
      <Title>
        <Translate pt="Hora de brilhar telepaticamente!" en="Time to shine telepathically!" />
      </Title>
      <Instruction contained>
        <Translate
          pt="Você como Medium agora pode tentar adivinhar quantas pessoas irão ganhar pontos com sua dica. Lembre-se que ganhar pontos significa acertar o numero ou qualquer um dos dois espaços em cada lado do ponteiro."
          en="You as the Psychic can now try to guess how many people will get points with your clue. Remember that players get points by getting the right number or any of the two neighboring numbers."
        />
      </Instruction>
      <ButtonContainer>
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: false })}
          size="large"
          disabled={isLoading}
        >
          <Translate pt="Menos da metade" en="Less the half" />
        </Button>
        <Button type="primary" onClick={() => onSendGuess({ guess: true })} size="large" disabled={isLoading}>
          <Translate pt="A metade ou mais" en="Half or more" />
        </Button>
      </ButtonContainer>

      <Dial card={currentCategory} target={currentCategory.target} showTarget />
    </Step>
  );
}

StepPsychicGuess.propTypes = {
  currentCategory: PropTypes.shape({
    left: PropTypes.string,
    right: PropTypes.string,
    target: PropTypes.number,
  }),
  onSendGuess: PropTypes.func,
};

export default StepPsychicGuess;
