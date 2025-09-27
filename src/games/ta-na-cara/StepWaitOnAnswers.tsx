// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhaseAnsweringState } from './utils/types';
import { usePersistentEliminator } from './utils/usePersistentEliminator';
import { CharactersBoard } from './components/CharactersBoard';
import { AllAnswersDrawer } from './components/AllAnswersDrawer';
// Ant Design Resources
// Hooks
// Icons

type StepWaitOnAnswersProps = {
  gameId: GameId;
  players: GamePlayers;
  user: GamePlayer;
} & Pick<
  PhaseAnsweringState,
  'grid' | 'identitiesDict' | 'currentQuestionId' | 'questionsDict' | 'questionCount'
>;

export function StepWaitOnAnswers({
  gameId,
  players,
  user,
  identitiesDict,
  grid,
  currentQuestionId,
  questionsDict,
  questionCount,
}: StepWaitOnAnswersProps) {
  const userIdentityId = user?.identity?.identityId;
  const {
    selectedPlayer,
    toggleEliminatePersonForPlayer,
    toggleSelectedPlayerId,
    selectedIdentityIds,
    votes,
  } = usePersistentEliminator(gameId, players);

  return (
    <Step fullWidth>
      <StepTitle wait>
        <Translate pt="Vai Analisando as Respostas" en="Meanwhile, Analyze the Answers" />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              A medida que os jogadores vão respondendo, as respostas serão adicionadas a cada um deles. Você
              pode ir já analisando e selecionando quem você achar que pode ser a identidade secreta. Tá na
              cara!
            </>
          }
          en={
            <>
              As players respond, their answers will be added to each of them. You can start analyzing and
              selecting who you think might be the secret identity. It's written all over their faces!
            </>
          }
        />
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
    </Step>
  );
}
