// Hooks
import { useUser } from 'hooks/useUser';
import { useStep } from 'hooks/useStep';
import { useOnSubmitDecisionAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { StreetIcon } from 'icons/StreetIcon';
// Components
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { ImageCardPreloadHand } from 'components/image-cards';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepMakeDecision } from './StepMakeDecision';
import { PlayerStats } from './components/PlayerStats';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

export function PhaseTrickOrTreat({ state, players, info }: PhaseProps) {
  const user = useUser(players, state);

  const isNewStreet = state.street.length === 0;
  const { step, goToNextStep } = useStep(isNewStreet ? 0 : 2);

  const onSubmitDecision = useOnSubmitDecisionAPIRequest();

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.TRICK_OR_TREAT}>
      <StepSwitcher step={step} players={players} waitingRoom={{ content: <PlayerStats user={user} /> }}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={goToNextStep}
          time={5}
          circleColor={info?.appearance?.color}
        >
          <Instruction contained>
            <Translate
              pt={`Vamos pegar doces na Rua do Medo ${state.round.current} de ${state.round.total}`}
              en={`Let's get candy on Fear Street ${state.round.current} of ${state.round.total}`}
            />
          </Instruction>
          <ImageCardPreloadHand hand={[state.currentCard.key]} />
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<StreetIcon />}
          title={<Translate pt="Gostosuras ou Travessuras?" en="Trick or Treat?" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={5}
          type="block"
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Nova rua! Vamos de porta em porta pegar doces!
                  <br />
                  Espero que essa rua não dê medo...
                </>
              }
              en={
                <>
                  New street! Let's go door to door to get candy!
                  <br />I hope this street is not scary...
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepMakeDecision
          players={players}
          street={state.street}
          currentCard={state.currentCard}
          candySidewalk={state.candySidewalk}
          cashedInCandy={state.cashedInCandy}
          candyPerPlayer={state.candyPerPlayer}
          candyInHand={state.candyInHand}
          totalCandyInSidewalk={state.totalCandyInSidewalk}
          continuingPlayerIds={state.continuingPlayerIds}
          alreadyAtHomePlayerIds={state.alreadyAtHomePlayerIds}
          onSubmitDecision={onSubmitDecision}
          user={user}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
