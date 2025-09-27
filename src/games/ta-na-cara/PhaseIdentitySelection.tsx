// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { AnonymousIcon } from 'icons/AnonymousIcon';
// Components
import { SuspectCard } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
// Internal
import { useOnSubmitIdentityAPIRequest } from './utils/api-requests';
import { TA_NA_CARA_PHASES } from './utils/constants';
import type { PhaseIdentitySelectionState } from './utils/types';
import { StepSelectCharacter } from './StepSelectCharacter';
// Icons

export function PhaseIdentitySelection({ players, state }: PhaseProps<PhaseIdentitySelectionState>) {
  const user = useUser(players, state);
  const { step, setStep } = useStep();

  const onSubmitIdentity = useOnSubmitIdentityAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<AnonymousIcon />}
      title={<Translate pt="Quem é você?" en="Who are you?" />}
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TA_NA_CARA_PHASES.IDENTITY_SELECTION}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          instruction: (
            <strong>
              <Translate pt="Esse(a) aqui é você" en="This is you" />:
            </strong>
          ),
          content: (
            <Flex align="center" justify="center" gap={8}>
              {user.newIdentityId && (
                <SuspectCard suspect={state.identitiesDict[user.newIdentityId]} width={100} />
              )}
            </Flex>
          ),
        }}
      >
        {/* Step 0 */}
        <StepSelectCharacter
          user={user}
          announcement={announcement}
          onSubmitIdentity={onSubmitIdentity}
          identitiesDict={state.identitiesDict}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
