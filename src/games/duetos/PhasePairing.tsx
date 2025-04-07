// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { SocksIcon } from 'icons/SocksIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitPairsAPIRequest } from './utils/api-requests';
import { DUETOS_PHASES } from './utils/constants';
import { MadePairs } from './components/MadePairs';
import { StepMakePairs } from './StepMakePairs';

export function PhasePairing({ players, state }: PhaseProps) {
  const user = useUser(players, state);
  const { step, setStep, goToNextStep } = useStep();

  const onSubmitPairs = useOnSubmitPairsAPIRequest(setStep);

  const announcement = (
    <PhaseAnnouncement
      icon={<SocksIcon />}
      title={<Translate pt="Coloque os itens em pares" en="Pair the items" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={<>Faça pares com os itens e ganhe pontos por cada par igual a de outros jogadores.</>}
          en={<>Pair the items and get points for each pair you match with other players </>}
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={DUETOS_PHASES.PAIRING}>
      <StepSwitcher
        step={step}
        players={players}
        waitingRoom={{
          content: <MadePairs pool={state.pool} pairs={user?.pairs ?? []} size="small" />,
        }}
      >
        <RoundAnnouncement round={state.round} time={3} onPressButton={goToNextStep} />
        {/* Step 0 */}
        <StepMakePairs
          user={user}
          announcement={announcement}
          pool={state.pool}
          onSubmitPairs={onSubmitPairs}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
