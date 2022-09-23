// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { StepGuessClover } from './StepGuessClover';
import { CloverIcon } from 'components/icons/CloverIcon';
import { ViewOr } from 'components/views';
import { TurnOrder } from 'components/players';
import { StepWaitClover } from './StepWaitClover';

function PhaseCloverGuessing({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const [activeCloverPlayer, isUserTheCloverPlayer] = useWhichPlayerIsThe('activeCloverId', state, players);

  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.CLOVER_GUESSING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CloverIcon />}
          title={translate('Hora de Adivinhar', 'Time to guess')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt="De um em um, vamos tentar adivinhar a posição das folhas em cada trevo"
              en="One at a time, let's try to guess the position of each leaf on each clover"
            />
          </Instruction>

          <TurnOrder players={players} activePlayerId={state.activeCloverId} order={state.gameOrder} />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewOr orCondition={isUserTheCloverPlayer}>
          <StepWaitClover
            activeCloverPlayer={activeCloverPlayer}
            clover={state.clover}
            leaves={state.leaves}
          />

          <StepGuessClover
            clover={state.clover}
            leaves={state.leaves}
            onSubmitGuess={onSubmitGuess}
            activeCloverPlayer={activeCloverPlayer}
            isUserTheCloverPlayer={isUserTheCloverPlayer}
          />
        </ViewOr>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCloverGuessing;
