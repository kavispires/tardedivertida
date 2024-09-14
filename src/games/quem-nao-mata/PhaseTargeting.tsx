// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { TDIcon } from 'icons/TDIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitMessageAPIRequest, useOnSubmitTargetAPIRequest } from './utils/api-requests';
import { StepTargeting } from './StepTargeting';

export function PhaseTargeting({ players, state, info }: PhaseProps) {
  const user = useUser(players, state);
  const { step, goToNextStep } = useStep(0);

  const onSubmitTarget = useOnSubmitTargetAPIRequest();
  const onSubmitMessage = useOnSubmitMessageAPIRequest();

  // const mockedPlayers = mockPlayers(players, 10, { alive: true, score: 0, messages: [], target: '1' });
  const mockedPlayers = players;

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_NAO_MATA.TARGETING}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={<Translate pt="Apontem suas armas!" en="Point your guns!" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          type="block"
        >
          <Instruction>
            <Translate pt="Tem alguém te olhando torto, heim..." en="Is anyone looking at you funny?" />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepTargeting
          players={mockedPlayers}
          user={user}
          onSubmitTarget={onSubmitTarget}
          onSubmitMessage={onSubmitMessage}
          messages={state.messages ?? {}}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
