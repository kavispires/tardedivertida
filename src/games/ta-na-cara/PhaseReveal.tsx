// Types
import { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
// Components
import { StepSwitcher } from 'components/steps';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { Instruction } from 'components/text';
import { SpotlightIcon } from 'icons/SpotlightIcon';
import { StepReveal } from './StepReveal';
import { StepRanking } from './StepRanking';

export function PhaseReveal({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, goToPreviousStep } = useStep();
  const [targetedPlayer] = useWhichPlayerIsThe('targetId', state, players);

  const announcement = (
    <PhaseAnnouncement
      icon={<SpotlightIcon />}
      title={<Translate pt="E a pessoa foi descoberta?" en="Was the person revealed?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate pt="Quem? O que? Esse?" en="Who? What? That?" />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TA_NA_CARA.REVEAL}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepReveal
          announcement={announcement}
          players={players}
          user={user}
          turnOrder={state.turnOrder}
          charactersDict={state.charactersDict}
          charactersIds={state.charactersIds}
          questionsDict={state.questionsDict}
          activePlayerId={state.activePlayerId}
          targetedPlayer={targetedPlayer}
          points={state.points ?? 1}
          correct={state.correct}
          goToNextStep={goToNextStep}
          result={state.result}
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
