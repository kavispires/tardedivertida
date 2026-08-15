// Types
import type { PhaseProps } from 'types/game';
// Icons
import { GarbageIcon } from '@icons/GarbageIcon';
import { QualitySealIcon } from '@icons/QualitySealIcon';
import { TheEndIcon } from '@icons/TheEndIcon';
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={state.outcome === 'WIN' ? <TrophyIcon /> : <TheEndIcon />}
      rateWidgetCustomText={
        <Translate
          pt="Sugira palavras-secretas"
          en="Suggest secret words"
        />
      }
    >
      <SpaceContainer
        orientation="vertical"
        align="center"
      >
        {state.outcome === 'WIN' ? (
          <>
            <Icon
              icon={<QualitySealIcon />}
              size={100}
              shape="square"
            />
            <Translate
              pt="VITÓRIA"
              en="WIN"
            />
          </>
        ) : (
          <>
            <Icon
              icon={<GarbageIcon />}
              size={100}
              shape="square"
            />
            <Translate
              pt="DERROTA"
              en="LOSE"
            />
          </>
        )}
      </SpaceContainer>
      <CategoryWordGroup
        categories={state.categories}
        secretWord={state.secretWord}
        showSecretWord
      />
      <Board
        players={players}
        clues={state.clues}
        board={state.board}
      />
    </GameOverWrapper>
  );
}
