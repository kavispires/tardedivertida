// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Components
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

type StepWaitingForPromptProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
  activePlayer: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepWaitingForPrompt({
  players,
  user,
  announcement,
  turnOrder,
  characters,
  questionsHistory,
  activePlayer,
}: StepWaitingForPromptProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt={
            <>
              Aguarde enquanto <PlayerAvatarName player={activePlayer} /> decide o que fazer
            </>
          }
          en={
            <>
              Please wait while <PlayerAvatarName player={activePlayer} /> takes an action
            </>
          }
        />
      </StepTitle>

      <SpaceContainer>
        <CharactersBoard
          characters={characters}
          players={players}
          user={user}
        />
        <QuestionHistory
          players={players}
          questionsHistory={questionsHistory}
        />
      </SpaceContainer>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
      />
    </Step>
  );
}
