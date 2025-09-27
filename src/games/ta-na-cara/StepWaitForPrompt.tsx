// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhasePromptingState } from './utils/types';
import { usePersistentEliminator } from './utils/usePersistentEliminator';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionsHighlight } from './components/Highlights';
import { AllAnswersDrawer } from './components/AllAnswersDrawer';

type StepWaitForPromptProps = {
  gameId: GameId;
  players: GamePlayers;
  user: GamePlayer;
  activePlayer: GamePlayer;
} & Pick<StepProps, 'announcement'> &
  Pick<PhasePromptingState, 'turnOrder' | 'grid' | 'identitiesDict' | 'questionCount' | 'questionsDict'>;

export function StepWaitForPrompt({
  gameId,
  players,
  user,
  announcement,
  activePlayer,
  identitiesDict,
  grid,
  turnOrder,
  questionCount,
  questionsDict,
}: StepWaitForPromptProps) {
  const playerCount = Object.keys(players).length;
  const {
    selectedPlayer,
    toggleEliminatePersonForPlayer,
    toggleSelectedPlayerId,
    selectedIdentityIds,
    votes,
  } = usePersistentEliminator(gameId, players);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle wait>
        <Translate
          pt={
            <>
              Aguarde enquanto <AvatarName player={activePlayer} /> seleciona uma pergunta
            </>
          }
          en={
            <>
              Please wait while <AvatarName player={activePlayer} /> selects a question
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate pt="Perguntas até a adivinhação" en="Questions until guessing" />{' '}
        <QuestionsHighlight>
          {questionCount}/{Math.max(5, playerCount)}
        </QuestionsHighlight>
      </RuleInstruction>

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

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayer.id} />
    </Step>
  );
}
