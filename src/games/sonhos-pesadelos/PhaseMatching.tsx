// Hooks
import { useIsUserReady, useUser, useLanguage, useStep } from 'hooks';
import { useOnSubmitVotesAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Instruction, StepSwitcher, Translate } from 'components';
import { StepMatchDreams } from './StepMatchDreams';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseMatching({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);

  const onSubmitVotes = useOnSubmitVotesAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SONHOS_PESADELOS.MATCHING}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="evaluate"
          title={translate('Combine os sonhos', 'Match the dreams')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

export default PhaseMatching;
