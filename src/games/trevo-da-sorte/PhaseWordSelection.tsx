// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitBadWordsAPIRequest } from './utils/api-requests';
import { TREVO_DA_SORTE_PHASES, WORST_TO_REMOVE } from './utils/constants';
import { StepSelectWords } from './StepSelectWords';

export function PhaseWordSelection({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitBadWords = useOnSubmitBadWordsAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TREVO_DA_SORTE_PHASES.WORD_SELECTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={4} />

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<VerifyListIcon />}
          title={<Translate pt="Seleção das Palavras" en="Words Selection" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate
              pt={`Selecione ${WORST_TO_REMOVE} palavras que você NÃO quer no jogo`}
              en={`Select ${WORST_TO_REMOVE} words you DO NOT want in the game`}
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepSelectWords hand={user.hand} onSubmitBadWords={onSubmitBadWords} />
      </StepSwitcher>
    </PhaseContainer>
  );
}
