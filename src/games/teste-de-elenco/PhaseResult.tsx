// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { Icons } from './utils/helpers';
import { StepRanking } from './StepRanking';
import { StepResult } from './StepResult';

export function PhaseResult({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const activeRole = state.movie.roles[state.activeRoleId];

  const Icon = Icons?.[state?.movie?.id] ?? MovieGenreIcon;

  const announcement = (
    <PhaseAnnouncement
      icon={<Icon />}
      title={
        <>
          <Translate pt="Resultado" en="Results" />: <DualTranslate>{activeRole.title}</DualTranslate>
        </>
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate pt={<>E o papel foi escolhido?</>} en={<>So was the role cast?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  //

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.TESTE_DE_ELENCO.RESULT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          user={user}
          activeRole={activeRole}
          outcome={state.outcome}
          players={players}
          announcement={announcement}
          goToNextStep={goToNextStep}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
