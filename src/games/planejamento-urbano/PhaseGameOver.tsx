// Types
import type { PhaseProps } from 'types/game';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { CityMap } from './components/CityMap';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<FlagIcon />}>
      <Achievements achievements={state.achievements} players={players} reference={achievementsReference} />

      <TitledContainer title={<Translate pt="Cidade Inaugurada" en="Final City" />}>
        {state.city && state.cityLocationsDict && (
          <CityMap city={state.city} cityLocationsDict={state.cityLocationsDict} />
        )}
      </TitledContainer>
    </GameOverWrapper>
  );
}
