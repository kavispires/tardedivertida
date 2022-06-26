import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
// Ant Design Resources
import { Alert } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useMock } from 'hooks';
// Utils
import { mockClues } from './utils/mock';
import { inNSeconds } from 'utils/helpers';
import { getAnimationClass } from 'utils/helpers';
import { SEPARATOR } from 'utils/constants';
import { WRITE_CLUE_TIME, WRITE_CLUE_TIME_FIRST_ROUND } from './utils/constants';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Board } from './components/Board';
import { ControlledInputWriting } from 'components/input';
import { ClueInput } from './components/ClueInput';
import { CategoryCard } from './components/CategoryCard';
import { TimerBar } from 'components/timers';

type StepPlayerClueProps = {
  secretWord: string;
  categories: string[];
  onSubmitClues: GenericFunction;
  board: VBoard;
  clues: VClues;
  boss: GamePlayer;
  finalAnswersLeft: number;
  cluesPerPlayer: number;
  players: GamePlayers;
  round: GameRound;
};

export function StepPlayerClue({
  secretWord,
  categories,
  onSubmitClues,
  board,
  clues,
  boss,
  finalAnswersLeft,
  cluesPerPlayer,
  players,
  round,
}: StepPlayerClueProps) {
  const [guessesIds, setGuessesIds] = useState<number[]>([]);
  const [disableInputs, setDisableInputs] = useState(false);

  useMock(() => {
    onSubmitClues({ clues: mockClues(cluesPerPlayer) });
  }, []);

  const timerTotal = round.current === 1 ? WRITE_CLUE_TIME_FIRST_ROUND : WRITE_CLUE_TIME;

  const { minutes, seconds } = useTimer({
    expiryTimestamp: inNSeconds(timerTotal),
    autoStart: true,
    onExpire: () => {
      setDisableInputs(true);
    },
  });

  const timer = minutes * 60 + seconds;

  const toggleGuessIds = (id: string, isGuess: boolean) => {
    const index = Number(id.split(SEPARATOR)[1]);
    setGuessesIds((s) => {
      let sCopy = [...s];
      if (isGuess) {
        sCopy.push(index);
        return sCopy;
      }
      return sCopy.filter((e) => e !== index);
    });
  };

  const onSubmitEverything = (payload: PlainObject) => {
    const clues: string[] = [];
    const guesses: string[] = [];
    payload.clues.forEach((clue: string, index: number) => {
      if (guessesIds.includes(index)) {
        guesses.push(clue);
      } else {
        clues.push(clue);
      }
    });

    onSubmitClues({
      clues,
      guesses,
    });
  };

  return (
    <Step fullWidth>
      <Title size="medium">
        <Translate pt="Escreva palpites" en="Write Ideas" />
      </Title>

      <CategoryCard categories={categories} />

      <Board board={board} clues={clues} players={players} />

      <Instruction contained>
        <Translate
          pt="Escreva pistas para ajudar a afunilar as possibilidades. Vocês tem 3 minutos"
          en="Write clues that will have narrow down the possibilities. You have 3 minutes"
        />
      </Instruction>

      <TimerBar value={timer} total={timerTotal} steps={timerTotal / 3} />

      <ControlledInputWriting
        onSubmit={onSubmitEverything}
        valueKey="clues"
        inputQuantity={cluesPerPlayer}
        inputComponent={ClueInput}
        restrictMax={!disableInputs}
        inputComponentProps={{
          toggleGuessIds,
          disabled: disableInputs,
        }}
        submitButtonLabel={
          guessesIds.length > 0 ? (
            <>
              {cluesPerPlayer > 1 ? (
                <Translate pt="Enviar dicas e respostas" en="Send clues and guesses" />
              ) : (
                <Translate pt="Enviar resposta" en="Send guess" />
              )}
            </>
          ) : (
            <>
              <Translate pt="Enviar dica" en="Send clue" />
              {cluesPerPlayer > 1 && 's'}
            </>
          )
        }
        submitButtonProps={{
          icon: <CloudUploadOutlined />,
          size: 'large',
        }}
      />

      {guessesIds.length > 0 && (
        <Instruction className={getAnimationClass('zoomIn')}>
          <Alert
            type="warning"
            showIcon
            message={
              <Translate
                pt={
                  <>
                    Você está prestes a enviar uma resposta. O grupo pode enviar um máximo de{' '}
                    {finalAnswersLeft} respostas. Se esse número exceder, o grupo perde o jogo imediatamente.
                  </>
                }
                en={
                  <>
                    You are about to send an Answer. The group may send a maximum of {finalAnswersLeft}{' '}
                    answers total. If this number is exceeded, the game is lost immediately.
                  </>
                }
              />
            }
          />
        </Instruction>
      )}

      <Instruction>
        <Alert
          type="info"
          showIcon
          description={
            finalAnswersLeft === 3 ? (
              <Translate
                pt={
                  <>
                    Durante o jogo, o grupo tem 3 chances de adivinhar a palavra secreta, para isso o jogador
                    que escrever a palavra secreta tem que marcar a sua dica como 'Resposta' clicando no
                    botãozinho 'Dica' na carta. <br /> O grupo ainda tem {finalAnswersLeft} chances sobrando
                    para adivinhar.
                  </>
                }
                en={
                  <>
                    During the game, the group has 3 chances of guessing the secret word, to do so the player
                    who wants to write the secret word must switch the type of answer to 'Guess' by clicking
                    on the 'Clue' button in the card.
                    <br /> The group still has {finalAnswersLeft} chances to guess.
                  </>
                }
              />
            ) : (
              <Translate
                pt={
                  <>
                    O grupo tem mais {finalAnswersLeft} chances de adivinhar a palavra secreta, para isso o
                    jogador que escrever a palavra secreta tem que marcar a sua dica como 'Resposta' clicando
                    no botãozinho 'Dica' na carta.
                  </>
                }
                en={
                  <>
                    The group has {finalAnswersLeft} more chances of guessing the secret word, to do so the
                    player who wants to write the secret word must switch the type of answer to 'Guess' by
                    clicking on the 'Clue' button in the card.
                  </>
                }
              />
            )
          }
        />
      </Instruction>
    </Step>
  );
}
