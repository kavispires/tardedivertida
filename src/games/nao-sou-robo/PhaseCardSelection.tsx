// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitCardAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { EventIcon } from 'icons/EventIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { RoundAnnouncement } from 'components/round';
import { StepSelectCard } from './StepSelectCard';

export function PhaseCardSelection({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NAO_SOU_ROBO.CARD_SELECTION}>
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
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
          circleColor={info?.appearance?.color}
        />

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
