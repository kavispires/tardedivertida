// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { CloverIcon } from 'icons/CloverIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { TurnOrder } from 'components/players/TurnOrder';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import { useOnSubmitGuessAPIRequest } from './utils/api-requests';
import { TREVO_DA_SORTE_PHASES } from './utils/constants';
import { StepGuessClover } from './StepGuessClover';
import { StepWaitClover } from './StepWaitClover';

export function PhaseCloverGuessing({ state, players }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const [activeCloverPlayer, isUserTheCloverPlayer] = useWhichPlayerIsThe('activeCloverId', state, players);

  const onSubmitGuess = useOnSubmitGuessAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TREVO_DA_SORTE_PHASES.CLOVER_GUESSING}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CloverIcon />}
          title={
            <Translate
              pt="Hora de Adivinhar"
              en="Time to guess"
            />
          }
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

          <TurnOrder
            players={players}
            activePlayerId={state.activeCloverId}
            order={state.gameOrder}
          />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <ViewIf condition={isUserTheCloverPlayer}>
          <StepWaitClover
            activeCloverPlayer={activeCloverPlayer}
            clover={state.clover}
            leaves={state.leaves}
          />
        </ViewIf>
        <ViewIf condition={!isUserTheCloverPlayer}>
          <StepGuessClover
            clover={state.clover}
            leaves={state.leaves}
            onSubmitGuess={onSubmitGuess}
            activeCloverPlayer={activeCloverPlayer}
            isUserTheCloverPlayer={isUserTheCloverPlayer}
          />
        </ViewIf>
      </StepSwitcher>
    </PhaseContainer>
  );
}
