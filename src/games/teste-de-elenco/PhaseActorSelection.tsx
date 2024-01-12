// Types
import { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitMovieActorAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { SofaIcon } from 'icons/SofaIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction, TextHighlight } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { DualTranslate, Translate } from 'components/language';
import { StepSelectActor } from './StepSelectActor';

export function PhaseActorSelection({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitActor = useOnSubmitMovieActorAPIRequest(setStep);

  const activeRole = state.movie.roles[state.activeRoleId];

  const announcement = (
    <PhaseAnnouncement
      icon={<SofaIcon />}
      title={
        <>
          <Translate pt="Seleção" en="Actor Selection" />: <DualTranslate>{activeRole.title}</DualTranslate>
        </>
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate pt={<>Quem vai ser o</>} en={<>Who is the best choice for</>} />
        <TextHighlight>
          <DualTranslate>{activeRole.description}</DualTranslate>
        </TextHighlight>
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TESTE_DE_ELENCO.ACTOR_SELECTION}>
      <StepSwitcher step={step} players={players}>
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
