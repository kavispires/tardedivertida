// Types
import type { PhaseProps } from 'types/game';
// Icons
import { GarbageIcon } from 'icons/GarbageIcon';
import { QualitySealIcon } from 'icons/QualitySealIcon';
import { TheEndIcon } from 'icons/TheEndIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { Board } from './components/Board';
import { CategoryWordGroup } from './components/CategoryWordGroup';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={state.outcome === 'WIN' ? <TrophyIcon /> : <TheEndIcon />}
      rateWidgetCustomText={<Translate pt="Sugira palavras-secretas" en="Suggest secret words" />}
    >
      <SpaceContainer direction="vertical" align="center">
        {state.outcome === 'WIN' ? (
          <>
            <IconAvatar icon={<QualitySealIcon />} size={100} shape="square" />
            <Translate pt="VITÓRIA" en="WIN" />
          </>
        ) : (
          <>
            <IconAvatar icon={<GarbageIcon />} size={100} shape="square" />
            <Translate pt="DERROTA" en="LOSE" />
          </>
        )}
      </SpaceContainer>
      <CategoryWordGroup categories={state.categories} secretWord={state.secretWord} showSecretWord />
      <Board players={players} clues={state.clues} board={state.board} />
    </GameOverWrapper>
  );
}
