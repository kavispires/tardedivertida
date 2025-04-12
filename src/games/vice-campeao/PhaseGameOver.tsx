// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Container } from 'components/layout/Container';
// Internal
import type { PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { AnimatedRaceTrack } from './components/AnimatedRaceTrack';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <Container title={<Translate pt="Corrida Completa" en="Full Race" />} className="mt-4">
        <AnimatedRaceTrack race={state.replay} players={players} cardsDict={state.cardsDict} />
      </Container>
    </GameOverWrapper>
  );
}
