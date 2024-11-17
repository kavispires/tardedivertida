// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { EvaluateIcon } from 'icons/EvaluateIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitVotesAPIRequest } from './utils/api-requests';
import { StepMatchDreams } from './StepMatchDreams';

export function PhaseMatching({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.MATCHING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<EvaluateIcon />}
          title={<Translate pt="Combine os sonhos" en="Match the dreams" />}
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
