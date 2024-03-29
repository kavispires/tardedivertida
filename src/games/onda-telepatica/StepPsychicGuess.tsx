// Ant Design Resources
import { Button, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { CurrentCategory } from './utils/types';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, TextHighlight, Title } from 'components/text';
import { Dial } from './components/Dial';

type StepPsychicGuessProps = {
  currentCategory: CurrentCategory;
  onSendGuess: GenericFunction;
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

export function StepPsychicGuess({
  currentCategory,
  onSendGuess,
  players,
  announcement,
}: StepPsychicGuessProps) {
  const { isLoading } = useLoading();

  useMock(() => {
    onSendGuess({ guess: false });
  }, []);

  return (
    <Step className="o-dial-guess-selection" announcement={announcement}>
      <Title size="small" white>
        <Translate
          pt="Quantos jogadores vão ganhar pontos com sua dica?"
          en="How many players will get points with your clue?"
        />
      </Title>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Você escreveu: <TextHighlight>{currentCategory.clue}</TextHighlight>
              <br />
              Você como Medium agora pode tentar adivinhar quantas pessoas irão ganhar pontos com sua dica.
              <br />
              Ganhar pontos significa acertar o numero ou qualquer um dos dois espaços em cada lado do
              ponteiro.
              <br />
              <i>Por exemplo, se a resposta for 3, jogadores que escolherem 1, 2, 3, 4, 5 ganham pontos.</i>
            </>
          }
          en={
            <>
              You wrote: <TextHighlight>{currentCategory.clue}</TextHighlight>
              <br />
              As the Psychic, you can now try to guess how many people will get points with your clue.
              <br />
              Players get points by getting the right number or any of the two neighboring numbers on each
              side.
              <br />
              <i>
                For example, if the answer is #3, players who voted for #1, #2, #3, #4, #5 will get points.
              </i>
            </>
          }
        />
      </RuleInstruction>

      <Space className="space-container" align="center">
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: false })}
          size="large"
          disabled={isLoading}
          loading={isLoading}
        >
          <Translate pt="Menos da metade" en="Less than half" />
        </Button>
        <Button
          type="primary"
          onClick={() => onSendGuess({ guess: true })}
          size="large"
          disabled={isLoading}
          loading={isLoading}
        >
          <Translate pt="A metade ou mais" en="Half or more" />
        </Button>
      </Space>

      <Dial card={currentCategory} target={currentCategory.target} showTarget />
    </Step>
  );
}
