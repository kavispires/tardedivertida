// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLoading, useMock } from 'hooks';
// Components
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Step } from 'components/steps';
import { Instruction, TextHighlight, Title } from 'components/text';
import { Dial } from './components/Dial';

type StepPsychicGuessProps = {
  currentCategory: OCurrentCategory;
  onSendGuess: GenericFunction;
  players: GamePlayers;
};

export function StepPsychicGuess({ currentCategory, onSendGuess, players }: StepPsychicGuessProps) {
  const { isLoading } = useLoading();

  useMock(() => {
    onSendGuess({ guess: false });
  }, []);

  return (
    <Step className="o-dial-guess-selection">
      <Title size="small">
        <Translate pt="Hora de brilhar telepaticamente!" en="Time to shine telepathically!" />
        <br />
        <Translate pt="Você escreveu" en="a" />: <TextHighlight>{currentCategory.clue}</TextHighlight>
      </Title>
      <Instruction contained>
        <Translate
          pt="Você como Medium agora pode tentar adivinhar quantas pessoas irão ganhar pontos com sua dica. Lembre-se que ganhar pontos significa acertar o numero ou qualquer um dos dois espaços em cada lado do ponteiro."
          en="You as the Psychic can now try to guess how many people will get points with your clue. Remember that players get points by getting the right number or any of the two neighboring numbers on each side."
        />
      </Instruction>
      <Space className="space-container" align="center">
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: false })}
          size="large"
          disabled={isLoading}
        >
          <Translate pt="Menos da metade" en="Less than half" />
        </Button>
        <Button type="primary" onClick={() => onSendGuess({ guess: true })} size="large" disabled={isLoading}>
          <Translate pt="A metade ou mais" en="Half or more" />
        </Button>
      </Space>

      <Dial card={currentCategory} target={currentCategory.target} showTarget />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
