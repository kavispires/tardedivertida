// Types
import { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { Icons } from './utils/helpers';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { DualTranslate, Translate } from 'components/language';
import { StepRanking } from './StepRanking';
import { StepResult } from './StepResult';

export function PhaseResult({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TESTE_DE_ELENCO.RESULT}>
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
