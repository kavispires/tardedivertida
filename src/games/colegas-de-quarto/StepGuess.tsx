import { cloneDeep, orderBy } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { App, Badge, Flex } from 'antd';
// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { DevButton } from '@components/debug/DevButton';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerSpace } from '@components/player/PlayerSpace';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type {
  BoardEntry,
  GuessedPair,
  HouseHappiness,
  PlayerAssignedPair,
  SubmitGuessesPayload,
} from './utils/types';
import { mockGuesses } from './utils/mock';
import { parseGuesses } from './utils/helpers';
import { HappinessTracker } from './components/HappinessTracker';
import { SelectableStoreBoard } from './components/SelectableStoreBoard';
import { Label } from './components/Label';

type StepGuessProps = {
  players: GamePlayers;
  user: GamePlayer;
  board: BoardEntry[];
  happiness: HouseHappiness;
  round: GameRound;
  onSubmitGuesses: (payload: SubmitGuessesPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepGuess({
  announcement,
  board,
  happiness,
  user,
  players,
  round,
  onSubmitGuesses,
}: StepGuessProps) {
  const { message } = App.useApp();

  const [guessedPairs, setGuessedPairs] = useState<Dictionary<GuessedPair>>(
    Object.values(players).reduce((acc: Dictionary<GuessedPair>, player) => {
      player.assignedPairs.forEach((pair: PlayerAssignedPair, index: number) => {
        acc[pair.id] = {
          ...pair,
          playerId: player.id,
          avatarId: player.avatarId,
          playerName: player.name,
          color: getAvatarColorById(player.avatarId),
          index,
          guesses: player.id === user.id ? pair.ids : [],
        };
      });

      return acc;
    }, {}),
  );
  const [activeClueId, setActiveClueId] = useState<string | null>(null);

  const isComplete = Object.values(guessedPairs).every((entry) => entry.guesses.length === 2);

  const handleMatch = (boardEntryId: string) => {
    if (!activeClueId) {
      message.warning(
        <Translate
          pt="Selecione uma pista primeiro!"
          en="Select a clue first!"
        />,
      );
      return;
    }

    setGuessedPairs((prev) => {
      const currentGuesses = prev[activeClueId]?.guesses || [];
      const alreadyGuessed = currentGuesses.includes(boardEntryId);

      if (alreadyGuessed) {
        return {
          ...prev,
          [activeClueId]: {
            ...prev[activeClueId],
            guesses: currentGuesses.filter((id) => id !== boardEntryId),
          },
        };
      }

      if (currentGuesses.length >= 2) {
        message.warning(
          <Translate
            pt="Você só pode selecionar dois itens por pista! Desmarque um primeiro."
            en="You can only select two items per clue! Uncheck one first."
          />,
        );
        return prev;
      }

      const copy = cloneDeep(prev);
      // Remove it from any possible other clue
      Object.values(copy).forEach((pair) => {
        if (pair.id !== activeClueId && pair.guesses.includes(boardEntryId)) {
          pair.guesses = pair.guesses.filter((id) => id !== boardEntryId);
        }
      });

      return {
        ...copy,
        [activeClueId]: {
          ...copy[activeClueId],
          guesses: [...currentGuesses, boardEntryId],
        },
      };
    });
  };

  const handleSubmit = () => {
    if (isComplete) {
      onSubmitGuesses({ guesses: parseGuesses(guessedPairs, user.id) });
    }
  };

  useMock(() => {
    onSubmitGuesses({ guesses: parseGuesses(mockGuesses(guessedPairs, board, user.id), user.id) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>O que os outros colegas de quarto estão querendo dizer?</>}
          en={<>What are the other roommates trying to say?</>}
        />
      </StepTitle>
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Para cada uma das pistas, selecione duas coisas na loja que você acha que seu colega de quarto
              está tentando evitar.
              <br />A felicidade da casa ganha <PointsHighlight value={1} /> se pelo menos uma pessoa
              adivinhar o par.
              <br />A casa também ganha <PointsHighlight value={3} /> se o item final é o que ninguém tem
              nenhuma objeção.
            </>
          }
          en={
            <>
              For each of the clues, select two things in the store that you think your roommate is trying to
              avoid.
              <br />
              The house happiness gains <PointsHighlight value={1} /> if at least one person guesses the pair
              and even more <PointsHighlight value={3} /> if the final item is what no one has any objection
              to.
            </>
          }
        />
        <Flex justify="center">
          <HappinessTracker happiness={happiness} />
        </Flex>
      </RuleInstruction>

      <TitledContainer
        className="mb-4"
        title={
          <Translate
            pt="Pistas"
            en="Clues"
          />
        }
        contentProps={{ style: { justifyContent: 'center' } }}
      >
        {orderBy(Object.values(guessedPairs), [(o) => o.avatarId]).map((entry) => (
          <TransparentButton
            key={entry.id}
            onClick={() => setActiveClueId(entry.id)}
            active={activeClueId === entry.id}
            hoverType="tint"
            disabled={entry.playerId === user.id}
          >
            <PlayerSpace
              avatarId={entry.avatarId}
              withBorder
              orientation="vertical"
              style={{ alignItems: 'center', color: 'white' }}
              className="round-corners"
            >
              <Label
                name={entry.playerName}
                avatarId={entry.avatarId}
                index={entry.index}
              />
              <Badge
                count={entry.guesses.map(() => '✓').join('')}
                color="black"
                offset={[-12, 0]}
              >
                <TextHighlight className="cc-clue">{entry.clue}</TextHighlight>
              </Badge>
            </PlayerSpace>
          </TransparentButton>
        ))}
      </TitledContainer>

      <SelectableStoreBoard
        board={board}
        round={round}
        guessedPairs={guessedPairs}
        onSelectEntry={(boardEntryId) => handleMatch(boardEntryId)}
      />

      <SpaceFloat
        className="mt-4"
        enabled={isComplete}
      >
        <SendButton
          size="large"
          disabled={!isComplete}
          onClick={handleSubmit}
        >
          <Translate
            pt="Enviar"
            en="Submit"
          />
        </SendButton>

        <DevButton onClick={() => setGuessedPairs(mockGuesses(guessedPairs, board, user.id))} />
      </SpaceFloat>
    </Step>
  );
}
