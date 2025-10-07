import { useEffect } from 'react';
// Ant Design Resources
import { App } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { LoupeIcon } from 'icons/LoupeIcon';
import { OpinionsIcon } from 'icons/OpinionsIcon';
import { TimerIcon } from 'icons/TimerIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import {
  useOnGuessLocationAPIRequest,
  useOnMakeAccusationAPIRequest,
  useOnSendLastQuestionerAPIRequest,
} from './utils/api-requests';
import { ESPIAO_ENTRE_NOS_PHASES } from './utils/constants';
import { FinalAssessmentPreparationModal } from './components/FinalAssessmentPreparationModal';
import { StepInvestigation } from './StepInvestigation';

export function PhaseInvestigation({ state, players, user }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);

  const { notification } = App.useApp();

  const [, isUserTheSpy] = useWhichPlayerIsThe('currentSpyId', state, players);
  const [startingPlayer] = useWhichPlayerIsThe('startingPlayerId', state, players);

  const onGuessLocation = useOnGuessLocationAPIRequest(setStep);
  const onMakeAccusation = useOnMakeAccusationAPIRequest(setStep);
  const onSendLastQuestioner = useOnSendLastQuestionerAPIRequest(setStep);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (state.timeRemaining > 590000 && startingPlayer.name) {
      notification.info({
        message: translate('10 minutos!', '10 minutes!'),
        description: translate(
          `${startingPlayer.name} começa perguntando!`,
          `${startingPlayer.name} starts questioning!`,
        ),
        duration: 10,
      });
    }
  }, [startingPlayer.name]);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={ESPIAO_ENTRE_NOS_PHASES.INVESTIGATION}
      className="e-phase"
    >
      <StepSwitcher step={step} players={players}>
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
            type="block"
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
            type="block"
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
          type="block"
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
