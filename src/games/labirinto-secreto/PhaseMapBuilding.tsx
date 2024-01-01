// Types
import type { MapSegment } from './utils/types';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitMapAPIRequest } from './utils/api-requests';
// Icons
import { MapIcon } from 'icons/MapIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepBuildMap } from './StepBuildMap';
import { PlayerSelectionMap } from './components/PlayerSelection';
import { StepBuildWait } from './StepBuildWait';
import { ViewOr } from 'components/views';

export function PhaseMapBuilding({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitMap = useOnSubmitMapAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<MapIcon />}
      title={
        state.round.current === 1 ? (
          <Translate pt="Construa o seu mapa" en="Build your map" />
        ) : (
          <Translate pt="Expanda seu mapa" en="Expand your map" />
        )
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt="Você consegue mapear as árvores usando apenas adjetivos?"
          en="Can you map the tree path using only adjectives?"
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  const isUserMapComplete = user?.map && user.map.every((segment: MapSegment) => segment.passed);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LABIRINTO_SECRETO.MAP_BUILDING}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: <PlayerSelectionMap forest={state.forest} map={user.map} newMap={user.newMap} />,
        }}
      >
        {/* Step 0 */}
        <ViewOr condition={isUserMapComplete}>
          <StepBuildWait user={user} announcement={announcement} forest={state.forest} />

          <StepBuildMap
            players={players}
            user={user}
            announcement={announcement}
            forest={state.forest}
            currentRound={state.round.current}
            onSubmitMap={onSubmitMap}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
