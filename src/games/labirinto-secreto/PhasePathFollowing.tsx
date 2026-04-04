import { Fragment } from 'react/jsx-runtime';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { DirectionsIcon } from 'icons/DirectionsIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { TurnOrder } from 'components/players/TurnOrder';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import { useOnSubmitPathAPIRequest } from './utils/api-requests';
import { LABIRINTO_SECRETO_PHASES } from './utils/constants';
import type { PhasePathFollowingState } from './utils/types';
import { StepFollowPath } from './StepFollowPath';
import { StepPathWaiting } from './StepPathWaiting';

export function PhasePathFollowing({ state, players, user }: PhaseProps<PhasePathFollowingState>) {
  const { step, setStep } = useStep();
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPath = useOnSubmitPathAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<DirectionsIcon />}
      title={
        <Translate
          pt="Siga os mapas!"
          en="Follow the maps!"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={3}
    >
      <Instruction>
        <Translate
          pt="Vamos analisar e tentar seguir o mapa de cada jogador"
          en="Let's analise and try to follow the each player's map"
        />
        <br />
        <TurnOrder
          players={players}
          order={state.turnOrder}
          activePlayerId={state.activePlayerId}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={LABIRINTO_SECRETO_PHASES.PATH_FOLLOWING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <Fragment>
          <ViewIf condition={isTheActivePlayer}>
            <StepPathWaiting
              players={players}
              announcement={announcement}
              forest={state.forest}
              activePlayer={activePlayer}
            />
          </ViewIf>
          <ViewIf condition={!isTheActivePlayer}>
            <StepFollowPath
              players={players}
              user={user}
              announcement={announcement}
              forest={state.forest}
              onSubmitPath={onSubmitPath}
              activePlayer={activePlayer}
              isTheActivePlayer={isTheActivePlayer}
            />
          </ViewIf>
        </Fragment>
      </StepSwitcher>
    </PhaseContainer>
  );
}
