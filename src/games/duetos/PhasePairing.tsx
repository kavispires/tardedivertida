// Types
import type { PhaseProps } from 'types/game';
// State & Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { useOnSubmitPairsAPIRequest } from './utils/api-requests';
// Icons
import { SocksIcon } from 'icons/SocksIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { Translate } from 'components/language';
import { RoundAnnouncement } from 'components/round';
import { MadePairs } from './components/MadePairs';
import { StepMakePairs } from './StepMakePairs';

export function PhasePairing({ players, state, info }: PhaseProps) {
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.DUETOS.PAIRING}>
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
