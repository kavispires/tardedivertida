// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { LawIcon } from 'icons/LawIcon';
// Components
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnChooseTheCriminalAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import type { PhaseTrialState } from './utils/types';
import { StepVoteForFinalElimination } from './StepVoteForFinalElimination';

export function PhaseFinalTrial({ state, players, user }: PhaseProps<PhaseTrialState>) {
  const { step, setStep } = useStep(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSelectCriminal = useOnChooseTheCriminalAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<LawIcon />}
      title={
        <Translate
          pt="O Julgamento Final"
          en="The Final Trial"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Chegamos os dois últimos suspeitos! Agora é hora do julgamento final.</>}
          en={<>We have reached the final two suspects! Now it's time for the final trial.</>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.FINAL_TRIAL}
    >
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: (
            <Flex
              align="center"
              justify="center"
            >
              {user.suspectId && (
                <Flex vertical>
                  <ImageCard
                    cardId={user.suspectId}
                    preview={false}
                    className="t-suspects-table__suspect-image"
                    cardWidth={84}
                  />
                </Flex>
              )}
            </Flex>
          ),
        }}
      >
        {/* Step 0 */}
        <StepVoteForFinalElimination
          suspectsDict={state.suspectsDict}
          suspectsIds={state.suspectsIds}
          previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
          perpetratorId={state.perpetratorId}
          isUserTheWitness={isUserTheWitness}
          witness={witness}
          onSelectCriminal={onSelectCriminal}
          question={state.question}
          eliminatedSuspects={state.eliminatedSuspects}
          testimony={state.testimony}
          history={state.history}
          announcement={announcement}
          status={state.status}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
