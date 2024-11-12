// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { DirectionsIcon } from 'icons/DirectionsIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TurnOrder } from 'components/players';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import { useOnSubmitPathAPIRequest } from './utils/api-requests';
import { StepFollowPath } from './StepFollowPath';
import { StepPathWaiting } from './StepPathWaiting';

export function PhasePathFollowing({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();
  const [activePlayer, isTheActivePlayer] = useWhichPlayerIsThe('activePlayerId', state, players);

  const onSubmitPath = useOnSubmitPathAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<DirectionsIcon />}
      title={<Translate pt="Siga os mapas!" en="Follow the maps!" />}
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
        <TurnOrder players={players} order={state.turnOrder} activePlayerId={state.activePlayerId} />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.LABIRINTO_SECRETO.PATH_FOLLOWING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <ViewOr condition={isTheActivePlayer}>
          <StepPathWaiting
            players={players}
            announcement={announcement}
            forest={state.forest}
            activePlayer={activePlayer}
          />

          <StepFollowPath
            players={players}
            user={user}
            announcement={announcement}
            forest={state.forest}
            onSubmitPath={onSubmitPath}
            activePlayer={activePlayer}
            isTheActivePlayer={isTheActivePlayer}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}
