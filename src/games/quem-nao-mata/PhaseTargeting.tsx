import { useMemo } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useStep, useUser } from 'hooks';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { TDIcon } from 'components/icons/TDIcon';
import { Translate } from 'components/language';
import { StepTargeting } from './StepTargeting';
import { mockPlayers } from 'mock/players';
import { useOnSubmitMessageAPIRequest, useOnSubmitTargetAPIRequest } from './utils/api-requests';

function PhaseTargeting({ players, state, info }: PhaseProps) {
  const isUserReady = useIsUserReady(players, state);
  const user = useUser(players);
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);

  const onSubmitTarget = useOnSubmitTargetAPIRequest();
  const onSubmitMessage = useOnSubmitMessageAPIRequest();

  // const mockedPlayers = mockPlayers(players, 10, { alive: true, score: 0, messages: [], target: '1' });
  const mockedPlayers = players;

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.QUEM_NAO_MATA.TARGETING}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<TDIcon />}
          title={translate('Apontem suas armas!', 'Point your guns!')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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
        <span></span>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTargeting;