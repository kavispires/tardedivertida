// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitBadWordsAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { WORST_TO_REMOVE } from './utils/constants';
// Icons
import { VerifyListIcon } from 'icons/VerifyListIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { Translate } from 'components/language';
import { StepSelectWords } from './StepSelectWords';

function PhaseWordSelection({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitBadWords = useOnSubmitBadWordsAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.WORD_SELECTION}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          onPressButton={goToNextStep}
          time={4}
          circleColor={info?.appearance?.color}
        />

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<VerifyListIcon />}
          title={<Translate pt="Seleção das Palavras" en="Words Selection" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

export default PhaseWordSelection;
