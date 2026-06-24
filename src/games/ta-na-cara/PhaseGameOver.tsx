// Types
import type { PhaseProps } from 'types/game';
// Icons
import { FlagIcon } from '@icons/FlagIcon';
// Components
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import type { PhaseGameOverState } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

export function PhaseGameOver({ state, players, user }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<FlagIcon />}
    >
      <SpaceContainer>
        <CharactersBoard
          characters={state.characters}
          players={players}
          user={user}
          revealCharacters
        />
        <QuestionHistory
          players={players}
          questionsHistory={state.questionsHistory}
        />
      </SpaceContainer>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
