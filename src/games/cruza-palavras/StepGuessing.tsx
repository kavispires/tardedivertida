import { DndContext, useSensors, useSensor, PointerSensor, type DragEndEvent } from '@dnd-kit/core';
import { useState, useCallback, useMemo, useEffect } from 'react';
// Ant Design Resources
import { ThunderboltOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { getColorFromIndex, shuffle } from 'utils/helpers';
// Components
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Clue, Grid, GridType, SubmitGuessesPayload } from './utils/types';
import { getClueFromKey, getClueKey, isClue } from './utils/helpers';
import { WordGrid } from './components/WordGrid';
import { SelectableCell } from './components/SelectableCell';
import { Clues } from './components/Clues';

type StepGuessingProps = {
  grid: Grid;
  gridType: GridType;
  user: GamePlayer;
  clues: Clue[];
  onSubmitGuesses: (payload: SubmitGuessesPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepGuessing({
  grid,
  gridType,
  user,
  clues,
  onSubmitGuesses,
  announcement,
}: StepGuessingProps) {
  const [active, setActive] = useState<Clue | number | null>(null);
  const [guesses, setGuesses] = useState<NumberDictionary>({});
  const [choseRandomly, setChoseRandomly] = useState(false);

  const clueColors = useMemo(() => {
    return clues.sort().reduce((acc: Dictionary<string>, clue, i) => {
      acc[clue.clue] = getColorFromIndex(i);
      return acc;
    }, {});
  }, [clues]);

  const onActivateClue = useCallback(
    (newActiveClue: Clue) => {
      if (!active || isClue(active)) {
        setActive(newActiveClue);
        return;
      }

      if (typeof active === 'number') {
        setGuesses((prev) => ({
          ...prev,
          [getClueKey(newActiveClue)]: active,
        }));
        setActive(null);
      }
    },
    [active],
  );

  const prepareSubmitGuesses = useCallback(() => {
    const result = Object.entries(guesses).reduce((acc: PlainObject, [clueKey, value]) => {
      const [, playerId] = getClueFromKey(clueKey);
      acc[playerId] = value;
      return acc;
    }, {});

    onSubmitGuesses({ guesses: result, choseRandomly });
  }, [guesses, onSubmitGuesses, choseRandomly]);

  // Select player's own clue - place it on initialization
  useEffect(() => {
    const playersOwnClue = clues.find((clue) => clue.playerId === user.id);

    if (playersOwnClue) {
      // Find the matching cell in the grid for the player's clue
      const playerCells = grid.filter((cell) => cell.available && cell.playerId === user.id);

      if (playerCells.length > 0) {
        // If there's only one cell that belongs to the player, use that one
        const playerCell =
          playerCells.length === 1
            ? playerCells[0]
            : playerCells.find((cell) => cell.index === playersOwnClue.coordinate);

        if (playerCell) {
          // Make sure we're using the correct coordinate for the player's own clue
          setGuesses((prevGuesses) => ({
            ...prevGuesses,
            [getClueKey(playersOwnClue)]: playerCell.index,
          }));
        }
      }
    }
  }, [clues, grid, user.id]);

  const randomGuessThem = () => {
    const usedCells = Object.values(guesses);
    const usedClues = Object.keys(guesses);
    setChoseRandomly(true);

    const availableCells = shuffle(
      grid.filter((cell) => cell.available && cell.playerId !== user.id && !usedCells.includes(cell.index)),
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag distance before activation
      },
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const clueId = String(active.id);
        const cellId = Number(over.id);

        // Find the clue object that was dragged
        const draggedClue = clues.find((clue) => getClueKey(clue) === clueId);

        // Prevent moving player's own clue
        if (draggedClue?.playerId === user.id) {
          return;
        }

        // Check if the target cell already has a clue
        const cellIsOccupied = Object.values(guesses).includes(cellId);
        if (cellIsOccupied) {
          return;
        }

        // Check if the cell is available (not the player's own cell)
        const targetCell = grid.find((cell) => cell.index === cellId);
        if (targetCell && targetCell.playerId === user.id) {
          return;
        }

        if (draggedClue && typeof cellId === 'number') {
          setGuesses((prev) => ({
            ...prev,
            [clueId]: cellId,
          }));
        }
      }
    },
    [clues, guesses, user.id, grid],
  );

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Decifre as dicas!"
          en="Guess the cells!"
        />
      </StepTitle>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <Clues
          clues={clues}
          onActivateClue={onActivateClue}
          active={active}
          guesses={guesses}
          user={user}
          clueColors={clueColors}
        />

        <RuleInstruction type="action">
          <Translate
            pt="Arraste as dicas acima para as células correspondentes abaixo."
            en="Drag the clues above to their corresponding cells below."
          />
        </RuleInstruction>

        <SpaceContainer align="center">
          <Button
            size="large"
            type="dashed"
            onClick={randomGuessThem}
            icon={<ThunderboltOutlined />}
          >
            <Translate
              pt="Desistir"
              en="Give up"
            />
          </Button>
          <SendButton
            size="large"
            onClick={prepareSubmitGuesses}
            disabled={Object.keys(guesses).length !== clues.length}
          >
            <Translate
              pt="Enviar respostas"
              en="Send guesses"
            />
          </SendButton>
        </SpaceContainer>

        <WordGrid
          grid={grid}
          gridType={gridType}
          user={user}
          CellComponent={SelectableCell}
          cellComponentProps={{
            active,
            guesses,
            clues,
            clueColors,
            user,
          }}
        />
      </DndContext>
    </Step>
  );
}
