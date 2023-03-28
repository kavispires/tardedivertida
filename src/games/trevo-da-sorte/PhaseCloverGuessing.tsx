// State & Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { CloverIcon } from 'icons/CloverIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { StepGuessClover } from './StepGuessClover';
import { ViewOr } from 'components/views';
import { TurnOrder } from 'components/players';
import { StepWaitClover } from './StepWaitClover';

function PhaseCloverGuessing({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep, setStep } = useStep(0);
  const [activeCloverPlayer, isUserTheCloverPlayer] = useWhichPlayerIsThe('activeCloverId', state, players);

  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.TREVO_DA_SORTE.CLOVER_GUESSING}>
      <StepSwitcher step={step} conditions={[!user.isReady, !user.isReady, !user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CloverIcon />}
          title={<Translate pt="Hora de Adivinhar" en="Time to guess" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
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
        <ViewOr condition={isUserTheCloverPlayer}>
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
