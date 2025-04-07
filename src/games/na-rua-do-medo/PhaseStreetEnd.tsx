// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useUser } from 'hooks/useUser';
// Icons
import { HouseIcon } from 'icons/HouseIcon';
import { ScaredIcon } from 'icons/ScaredIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { NA_RUA_DO_MEDO_PHASES } from './utils/constants';
import { StepStreetEnd } from './StepStreetEnd';

export function PhaseStreetEnd({ state, players }: PhaseProps) {
  const { step } = useStep(0);
  const user = useUser(players, state);

  const announcement = (
    <PhaseAnnouncement
      icon={state.isDoubleHorror ? <ScaredIcon /> : <HouseIcon />}
      title={<Translate pt="Fim da Rua" en="End of the Street" />}
      currentRound={state?.round?.current}
      duration={3}
      type="overlay"
    >
      <Instruction>
        {state.isDoubleHorror ? (
          <Translate pt="Corre cambada!!!" en="Run for your life!!!" />
        ) : (
          <Translate pt="E todo mundo foi pra casa..." en="And everybody went home..." />
        )}
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={NA_RUA_DO_MEDO_PHASES.STREET_END}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepStreetEnd
          street={state.street}
          currentCard={state.currentCard}
          candySidewalk={state.candySidewalk}
          user={user}
          isDoubleHorror={state.isDoubleHorror}
          round={state.round}
          players={players}
          alreadyAtHomePlayerIds={state.alreadyAtHomePlayerIds}
          goingHomePlayerIds={state.goingHomePlayerIds}
          continuingPlayerIds={state.continuingPlayerIds}
          candyInHand={state.candyInHand}
          announcement={announcement}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
