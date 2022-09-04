// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';
import { RoundAnnouncement } from 'components/round';
import { useStep } from 'hooks/useStep';
import { Translate } from 'components/language';
import { useOnSubmitBadWordsAPIRequest } from './utils/api-requests';
import { StepSelectWords } from './StepSelectWords';
import { WORST_TO_REMOVE } from './utils/constants';

function PhaseWordSelection({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const user = useUser(players);
  const { step, goToNextStep, setStep } = useStep(0);

  const onSubmitBadWords = useOnSubmitBadWordsAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.WORD_SELECTION}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} onPressButton={goToNextStep} time={4} circleColor="green" />

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={translate('Seleção das Palavras', 'Words Selection')}
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
