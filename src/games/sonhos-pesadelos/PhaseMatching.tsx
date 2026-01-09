// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitVotesAPIRequest } from './utils/api-requests';
import { SONHOS_PESADELOS_PHASES } from './utils/constants';
import { StepMatchDreams } from './StepMatchDreams';

export function PhaseMatching({ state, players, user }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={SONHOS_PESADELOS_PHASES.MATCHING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<EvaluateIcon />}
          title={
            <Translate
              pt="Combine os sonhos"
              en="Match the dreams"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Selecione os pares de dica e carta.
                  <br />
                  Mais de um jogador pode ter o mesmo sonho.
                </>
              }
              en={
                <>
                  Match the pairs of cards and clues.
                  <br />
                  More than one player may have the same card.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepMatchDreams
          players={players}
          user={user}
          table={state.table}
          onSubmitVotes={onSubmitVotes}
          dreams={state.dreams}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
