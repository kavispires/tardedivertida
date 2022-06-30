import { useState, useCallback } from 'react';
import { useEffectOnce } from 'react-use';
//Design Resources
import { Button, Space } from 'antd';
// Utils
import { shuffle } from 'utils/helpers';
import { getClueFromKey, getClueKey, isClue } from './utils/helpers';
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { WordGrid } from './components/WordGrid';
import { SelectableCell } from './components/SelectableCell';
import { Clues } from './components/Clues';

type StepGuessingProps = {
  grid: CruzaPalavraGrid;
  user: GamePlayer;
  clues: CruzaPalavrasClue[];
  onSubmitGuesses: GenericFunction;
  players: GamePlayers;
};

export function StepGuessing({ grid, user, clues, onSubmitGuesses, players }: StepGuessingProps) {
  const [active, setActive] = useState(null);
  const [guesses, setGuesses] = useState<any>({});

  const onSelectClue = useCallback(
    (clueIndex: any) => {
      if (!active || isClue(active)) {
        setActive(clueIndex);
      } else {
        setGuesses((state: any) => ({
          ...state,
          [getClueKey(clueIndex)]: active,
        }));
        setActive(null);
      }
    },
    [active]
  );

  const onSelectCell = useCallback(
    (cellCoordinate: any) => {
      if (!isClue(active)) {
        setActive(cellCoordinate);
      } else {
        setGuesses((state: any) => {
          const newState = Object.entries(state).reduce((acc: PlainObject, [key, value]) => {
            if (key && value && value !== cellCoordinate) {
              acc[key] = value;
            }
            return acc;
          }, {});

          newState[getClueKey(active!)] = cellCoordinate;

          setActive(null);
          return newState;
        });
      }
    },
    [active]
  );

  const onClearCell = (clueKey: string) => {
    setGuesses((state: PlainObject) => {
      const newState = { ...state };
      delete newState[clueKey];
      return newState;
    });
  };

  const prepareSubmitGuesses = useCallback(() => {
    const result = Object.entries(guesses).reduce((acc: PlainObject, [clueKey, value]) => {
      const [, playerId] = getClueFromKey(clueKey);
      acc[playerId] = value;
      return acc;
    }, {});

    onSubmitGuesses({ guesses: result });
  }, [guesses, onSubmitGuesses]);

  // Select player's own clue
  useEffectOnce(() => {
    const playersOwnClue = clues.find((clue) => clue.playerId === user.id);

    setGuesses({
      [getClueKey(playersOwnClue)]: playersOwnClue?.coordinate,
    });
  });

  const randomGuessThem = () => {
    const usedCells = Object.values(guesses);
    const usedClues = Object.keys(guesses);

    const availableCells = shuffle(
      grid.filter((cell) => cell.available && cell.playerId !== user.id && !usedCells.includes(cell.index))
    );
    const availableClues = clues.filter((clue) => !usedClues.includes(getClueKey(clue)));
    const newGuesses = availableClues.reduce((acc: PlainObject, clueObj, index) => {
      if (clueObj.playerId === user.id) {
        acc[getClueKey(clueObj)] = clueObj.coordinate;
      } else {
        acc[getClueKey(clueObj)] = availableCells[index].index;
      }
      return acc;
    }, {});
    setGuesses({
      ...newGuesses,
      ...guesses,
    });
  };

  return (
    <Step fullWidth>
      <Title>
        <Translate pt="Decifre as dicas!" en="Guess the cells!" />
      </Title>

      <Clues clues={clues} onSelectClue={onSelectClue} active={active} guesses={guesses} />
      <Instruction contained>
        <Translate
          pt="Clique em uma dica acima e em uma célula abaixo, ou vice-versa."
          en="Click on a clue above then on a cell below, or vice-versa."
        />
      </Instruction>

      <Space className="space-container" align="center">
        <Button
          size="large"
          type="primary"
          onClick={prepareSubmitGuesses}
          disabled={Object.keys(guesses).length !== clues.length}
        >
          <Translate pt="Enviar respostas" en="Send guesses" />
        </Button>
        <Button size="large" type="dashed" onClick={randomGuessThem}>
          <Translate pt="Desistir" en="Give up" />
        </Button>
      </Space>

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={SelectableCell}
        cellComponentProps={{ onSelectCell, onClearCell, active, guesses, clues, user }}
      />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
