// Types
import type { PhaseProps } from 'types/game';
// Icons
import { FlagIcon } from 'icons/FlagIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import { CityMap } from './components/CityMap';
// import { Achievements } from 'components/general/Achievements';
// Internal
// import { getReference } from './utils/helpers';
// import achievementsReference from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<FlagIcon />}>
      {/* <Achievements
        achievements={state.achievements}
        players={players}
        reference={achievementsReference}
      /> */}

      <TitledContainer title={<Translate pt="Cidade Inaugurada" en="Final City" />}>
        {state.city && state.cityLocationsDict && (
          <CityMap city={state.city} cityLocationsDict={state.cityLocationsDict} />
        )}
      </TitledContainer>
    </GameOverWrapper>
  );
}
