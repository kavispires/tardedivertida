import { useMemo } from 'react';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Icons
import { XIcon } from 'icons/XIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhaseGuessingState, SubmitGuessesPayload } from './utils/types';
import { usePersistentEliminator } from './utils/usePersistentEliminator';
import { mockGuesses } from './utils/mock';
import { CharactersBoard } from './components/CharactersBoard';
import { AllAnswersDrawer } from './components/AllAnswersDrawer';
// Ant Design Resources
// Hooks
// Icons

type StepMakeYourGuessesProps = {
  gameId: GameId;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitGuesses: (payload: SubmitGuessesPayload) => void;
} & Pick<PhaseGuessingState, 'grid' | 'identitiesDict' | 'questionsDict'> &
  Pick<StepProps, 'announcement'>;

export function StepMakeYourGuesses({
  gameId,
  players,
  user,
  identitiesDict,
  grid,
  questionsDict,
  onSubmitGuesses,
  announcement,
}: StepMakeYourGuessesProps) {
  const {
    selectedPlayer,
    toggleEliminatePersonForPlayer,
    toggleSelectedPlayerId,
    selectedIdentityIds,
    votes,
  } = usePersistentEliminator(gameId, players);

  useMock(() => {
    onSubmitGuesses({
      guesses: mockGuesses(user.id, players, grid),
    });
  });

  const isComplete = useMemo(() => {
    // Check if votes has an entry for each player except the user
    const playerIds = Object.keys(players).filter((playerId) => playerId !== user.id);

    // Check if all players have votes
    const allPlayersHaveVotes = playerIds.every((playerId) => !!votes[playerId]);
    if (!allPlayersHaveVotes) return false;

    // Check if each player has the correct number of eliminations (grid.length - 2)
    // We need all suspects eliminated except for one (grid.length - 1)
    // But the player's own identity isn't in their elimination list, so it's (grid.length - 2)
    const requiredTrueCount = grid.length - 2;

    return playerIds.every((playerId) => {
      const playerVotes = votes[playerId]?.eliminated || {};
      const trueCount = Object.values(playerVotes).filter((value) => value === true).length;
      return trueCount === requiredTrueCount;
    });
  }, [grid.length, players, user.id, votes]);

  const handleSubmitGuesses = () => {
    const guesses = Object.keys(players)
      .filter((playerId) => playerId !== user.id)
      .reduce(
        (acc, playerId) => {
          const playerVotes = votes[playerId]?.eliminated || {};
          const eliminatedIds = Object.keys(playerVotes).filter(
            (suspectId) => playerVotes[suspectId] === true,
          );

          // Find the non-eliminated suspect (there should be exactly one)
          // Filter out all suspects that have been eliminated
          const suspectIds = grid.filter(
            (suspectId) => !eliminatedIds.includes(suspectId) && suspectId !== user.identity.identityId,
          );

          // If there's exactly one non-eliminated suspect, use it as the guess
          if (suspectIds.length === 1) {
            acc[playerId] = suspectIds[0];
          }

          return acc;
        },
        {} as Dictionary<CardId>,
      );

    onSubmitGuesses({ guesses });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Faça suas suposições" en="Make Your Guesses" />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Clique em cada um dos jogadores para ativá-los e elimine todos os personagens que você acha que
              não cabem às respostas daquele jogador deixando apenas um personagem sem o{' '}
              <IconAvatar size="small" icon={<XIcon />} />. Quando você fizer isso com todos os jogadores, o
              botão de enviar ficará disponível.
            </>
          }
          en={
            <>
              Click on each player to activate them and eliminate all characters you think don't fit that
              player's answers, leaving only one character without the{' '}
              <IconAvatar size="small" icon={<XIcon />} />. When you do this for all players, the submit
              button will become available.
            </>
          }
        />
      </RuleInstruction>

      {isComplete && (
        <SpaceContainer>
          <SendButton size="large" onClick={handleSubmitGuesses}>
            <Translate pt="Enviar" en="Submit" />
          </SendButton>
        </SpaceContainer>
      )}

      <CharactersBoard
        grid={grid}
        identitiesDict={identitiesDict}
        playerSuspectId={user?.identity?.identityId}
        selectedPlayer={selectedPlayer}
        onSelectSuspect={toggleEliminatePersonForPlayer}
        tags={selectedIdentityIds}
        interactive
      />
      <AllAnswersDrawer
        players={players}
        grid={grid}
        questionsDict={questionsDict}
        user={user}
        selectedPlayerId={selectedPlayer?.id}
        setSelectedPlayerId={toggleSelectedPlayerId}
        votes={votes}
      />

      <SpaceContainer>
        <DevButton
          onClick={() =>
            onSubmitGuesses({
              guesses: mockGuesses(user.id, players, grid),
            })
          }
        >
          Mock
        </DevButton>
      </SpaceContainer>
    </Step>
  );
}
