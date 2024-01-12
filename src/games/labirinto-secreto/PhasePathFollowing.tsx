// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitPathAPIRequest } from './utils/api-requests';
// Icons
import { DirectionsIcon } from 'icons/DirectionsIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { StepFollowPath } from './StepFollowPath';
import { ViewOr } from 'components/views';
import { StepPathWaiting } from './StepPathWaiting';

export function PhasePathFollowing({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.LABIRINTO_SECRETO.PATH_FOLLOWING}>
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
