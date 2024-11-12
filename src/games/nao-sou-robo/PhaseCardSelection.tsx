// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { EventIcon } from 'icons/EventIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitCardAPIRequest } from './utils/api-requests';
import { StepSelectCard } from './StepSelectCard';

export function PhaseCardSelection({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep();

  const onSubmitCard = useOnSubmitCardAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<EventIcon />}
      title={<Translate pt="Tentativa de comprar ingressos" en="Attempt to buy tickets" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={5}
    >
      <Instruction>
        <Translate
          pt={<>Será que vamos conseguir ir no evento?</>}
          en={<>Will we be able to go to the event?</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.NAO_SOU_ROBO.CARD_SELECTION}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          instruction: (
            <Translate
              pt="O Sistema está processando sua compra..."
              en="The system is processing your order..."
            />
          ),
        }}
      >
        {/* Step 0 */}
        <RoundAnnouncement round={state.round} buttonText=" " onPressButton={goToNextStep} time={5} />

        {/* Step 1 */}
        <StepSelectCard
          user={user}
          announcement={announcement}
          onSubmitCard={onSubmitCard}
          captcha={state.captcha}
          players={players}
          robot={state.robot}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
