import { useEffect } from 'react';
// Ant Design Resources
import { notification } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import {
  useOnGuessLocationAPIRequest,
  useOnMakeAccusationAPIRequest,
  useOnSendLastQuestionerAPIRequest,
} from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepInvestigation } from './StepInvestigation';
import { FinalAssessmentPreparationModal } from './components/FinalAssessmentPreparationModal';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { LoupeIcon } from 'components/icons/LoupeIcon';
import { OpinionsIcon } from 'components/icons/OpinionsIcon';
import { TimerIcon } from 'components/icons/TimerIcon';

function PhaseInvestigation({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const user = useUser(players, state);

  const [, isUserTheSpy] = useWhichPlayerIsThe('currentSpyId', state, players);
  const [startingPlayer] = useWhichPlayerIsThe('startingPlayerId', state, players);

  const onGuessLocation = useOnGuessLocationAPIRequest(setStep);
  const onMakeAccusation = useOnMakeAccusationAPIRequest(setStep);
  const onSendLastQuestioner = useOnSendLastQuestionerAPIRequest(setStep);

  useEffect(() => {
    if (state.timeRemaining > 590000 && startingPlayer.name) {
      notification.info({
        message: translate('10 minutos!', '10 minutes!'),
        description: translate(
          `${startingPlayer.name} começa perguntando!`,
          `${startingPlayer.name} starts questioning!`
        ),
        duration: 10,
      });
    }
  }, [startingPlayer.name]); // eslint-disable-line

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION}
      className="e-phase"
    >
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        {state?.outcome?.type !== 'VOTE_FAIL' ? (
          <PhaseAnnouncement
            icon={<LoupeIcon />}
            title={<Translate pt="Investigação" en="Investigation" />}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={3}
          />
        ) : (
          <PhaseAnnouncement
            icon={<OpinionsIcon />}
            title={<Translate pt="A investigação continua" en="The investigation continues" />}
            onClose={goToNextStep}
            currentRound={state?.round?.current}
            buttonText=""
            className="e-phase-announcement"
            duration={3}
          >
            <Instruction>
              <Translate pt="A votação não foi unanime" en="The vote wasn't unanimous" />
            </Instruction>
          </PhaseAnnouncement>
        )}

        {/* Step 1 */}
        <StepInvestigation
          user={user}
          isUserTheSpy={isUserTheSpy}
          locations={state.locations}
          players={players}
          timer={state.timer}
          onGuessLocation={onGuessLocation}
          onMakeAccusation={onMakeAccusation}
          onSendLastQuestioner={onSendLastQuestioner}
          outcome={state.outcome}
          setStep={setStep}
        />

        {/* Step 2 */}
        <PhaseAnnouncement
          icon={<TimerIcon />}
          title={<Translate pt="O tempo acabou!!!" en="Time's up!!!" />}
          unskippable
          duration={300}
          onClose={() => {}}
          currentRound={state?.round?.current}
          buttonText=""
          className="e-phase-announcement"
        >
          <Instruction>
            <Translate pt="Preparado para a avaliação final?" en="Are you ready for the final assessment?" />
          </Instruction>
          <FinalAssessmentPreparationModal onSendLastQuestioner={onSendLastQuestioner} players={players} />
        </PhaseAnnouncement>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseInvestigation;
