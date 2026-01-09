// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { SofaIcon } from 'icons/SofaIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
// Internal
import { useOnSubmitMovieActorAPIRequest } from './utils/api-requests';
import { TESTE_DE_ELENCO_PHASES } from './utils/constants';
import { StepSelectActor } from './StepSelectActor';

export function PhaseActorSelection({ state, players, user }: PhaseProps) {
  const { step, setStep } = useStep();

  const onSubmitActor = useOnSubmitMovieActorAPIRequest(setStep);

  const activeRole = state.movie.roles[state.activeRoleId];

  const announcement = (
    <PhaseAnnouncement
      icon={<SofaIcon />}
      title={
        <>
          <Translate
            pt="Seleção"
            en="Actor Selection"
          />
          : <DualTranslate>{activeRole.title}</DualTranslate>
        </>
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Quem vai ser o</>}
          en={<>Who is the best choice for</>}
        />
        <TextHighlight>
          <DualTranslate>{activeRole.description}</DualTranslate>
        </TextHighlight>
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTE_DE_ELENCO_PHASES.ACTOR_SELECTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepSelectActor
          user={user}
          activeRole={activeRole}
          onSubmitActor={onSubmitActor}
          announcement={announcement}
          movie={state.movie}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
