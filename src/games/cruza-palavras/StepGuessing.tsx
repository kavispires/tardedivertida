import { useState, useCallback, useEffect } from 'react';
//Design Resources
import { Button } from 'antd';
// Utils
import { isDevEnv, shuffle } from '../../utils/helpers';
import { getClueFromKey, getClueKey, isClue } from './helpers';
// Components
import { ButtonContainer, Instruction, Title, Translate } from '../../components/shared';
import WordGrid from './WordGrid';
import SelectableCell from './SelectableCell';
import Clues from './Clues';

type StepGuessingProps = {
  grid: CruzaPalavraGrid;
  user: GamePlayer;
  clues: CruzaPalavrasClue[];
  onSubmitGuesses: GenericFunction;
};

function StepGuessing({ grid, user, clues, onSubmitGuesses }: StepGuessingProps) {
  const [active, setActive] = useState(null);
  const [guesses, setGuesses] = useState({});

  const onSelectClue = useCallback(
    (clueObj) => {
      if (!active || isClue(active)) {
        setActive(clueObj);
      } else {
        setGuesses((s) => ({
          ...s,
          [getClueKey(clueObj)]: active,
        }));
        setActive(null);
      }
    },
    [active]
  );

  const onSelectCell = useCallback(
    (cellCoordinate) => {
      if (!isClue(active)) {
        setActive(cellCoordinate);
      } else {
        setGuesses((state) => {
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

  const prepareSubmitGuesses = useCallback(() => {
    const result = Object.entries(guesses).reduce((acc: PlainObject, [clueKey, value]) => {
      const [, playerId] = getClueFromKey(clueKey);
      acc[playerId] = value;
      return acc;
    }, {});

    onSubmitGuesses(result);
  }, [guesses, onSubmitGuesses]);

  // Select player's own clue
  useEffect(() => {
    const playersOwnClue = clues.find((clue) => clue.playerId === user.id);

    setGuesses({
      [getClueKey(playersOwnClue)]: playersOwnClue?.coordinate,
    });

    if (isDevEnv) {
      const availableCells = shuffle(grid.filter((cell) => cell.available && cell.playerId !== user.id));

      setGuesses(
        clues.reduce((acc: PlainObject, clueObj, index) => {
          if (clueObj.playerId === user.id) {
            acc[getClueKey(clueObj)] = clueObj.coordinate;
          } else {
            acc[getClueKey(clueObj)] = availableCells[index].index;
          }
          return acc;
        }, {})
      );
    }
  }, []); // eslint-disable-line

  return (
    <div className="x-step">
      <Title>
        <Translate pt="Descifre as dicas!" en="Guess the cells!" />
      </Title>

      <Clues clues={clues} onSelectClue={onSelectClue} active={active} guesses={guesses} />

      {Object.keys(guesses).length === clues.length ? (
        <ButtonContainer>
          <Button size="large" type="primary" onClick={prepareSubmitGuesses}>
            <Translate pt="Enviar respostas" en="Send guesses" />
          </Button>
        </ButtonContainer>
      ) : (
        <Instruction contained>
          <Translate
            pt="Clique em uma dica acima e em uma célula abaixo, ou vice-versa."
            en="Click on a clue above then on a cell below, or vice-versa."
          />
        </Instruction>
      )}

      <WordGrid
        grid={grid}
        user={user}
        CellComponent={SelectableCell}
        cellComponentProps={{ onSelectCell, active, guesses, clues }}
      />
    </div>
  );
}

export default StepGuessing;
