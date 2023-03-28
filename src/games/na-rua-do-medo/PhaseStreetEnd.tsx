// Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { ScaredIcon } from 'icons/ScaredIcon';
import { HouseIcon } from 'icons/HouseIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepStreetEnd } from './StepStreetEnd';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

function PhaseStreetEnd({ state, players, info }: PhaseProps) {
  const { step, goToNextStep } = useStep(0);
  const user = useUser(players, state);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.STREET_END}>
      <StepSwitcher step={step} conditions={[!user.isReady]} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={state.isDoubleHorror ? <ScaredIcon /> : <HouseIcon />}
          title={<Translate pt="Fim da Rua" en="End of the Street" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={3}
          type="block"
        >
          <Instruction>
            {state.isDoubleHorror ? (
              <Translate pt="Corre cambada!!!" en="Run for your life!!!" />
            ) : (
              <Translate pt="E todo mundo foi pra casa..." en="And everybody went home..." />
            )}
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
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
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseStreetEnd;
