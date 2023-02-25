// Hooks
import { useStep } from 'hooks/useStep';
import { useOnSubmitBetsAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepMakeYourBets } from './StepMakeYourBets';
import { useUser } from 'hooks/useUser';
import { BetsFloatingHand } from './components/BetsFloatingHand';

function PhaseBets({ state, players, info }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const onSubmitBets = useOnSubmitBetsAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.SUPER_CAMPEONATO.BETS}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoomContent={
          Boolean(user.bets?.final) && (
            <BetsFloatingHand
              bets={user.bets}
              brackets={state.brackets}
              selectedContenderId={user.selectedContenderId}
            />
          )
        }
      >
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<GamblingChipIcon />}
          title={<Translate pt="Apostas" en="Bets" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
        >
          <Instruction>
            <Translate
              pt="Selecione quem você acha que ganha as quartas de final, semi final e final"
              en="Place bet on who you think will win the quarter-finals, semifinals, and finals"
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepMakeYourBets
          onSubmitBets={onSubmitBets}
          challenge={state.challenge}
          brackets={state.brackets}
          players={players}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseBets;
