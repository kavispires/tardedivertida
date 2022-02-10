import { useState } from 'react';
// Hooks
import { useIsUserReady, useUser, useLanguage } from '../../hooks';
import { useOnSubmitDecisionAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from '../../utils/phases';
// Components
import {
  ImageCardPreloadHand,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
} from '../../components';
import { StepMakeDecision } from './StepMakeDecision';

function PhaseTrickOrTreat({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const isNewStreet = state.street.length === 0;

  const [step, setStep] = useState(isNewStreet ? 0 : 1);

  const onSubmitDecision = useOnSubmitDecisionAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.NA_RUA_DO_MEDO.TRICK_OR_TREAT}>
      <StepSwitcher step={step} conditions={[!isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state.round}
          buttonText=" "
          onPressButton={() => setStep(1)}
          time={5}
          circleColor="black"
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
          type={isNewStreet ? 'street' : 'trick-or-treat'}
          title={translate('Gostosuras ou Travessuras?', 'Trick or Treat?')}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          duration={isNewStreet ? 6 : 3}
        >
          <Instruction>
            {isNewStreet ? (
              <Translate
                pt={<>Nova rua! Vamos de porta em porta pegar doces!</>}
                en={<>New street! Let's go door to door to get candy!</>}
              />
            ) : (
              <Translate
                pt={<>Espero que a próxima casa não dê medo...</>}
                en={<>I hope the next house is not scary...</>}
              />
            )}
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepMakeDecision
          players={players}
          street={state.street}
          currentCard={state.currentCard}
          candySidewalk={state.candySidewalk}
          totalCandyInSidewalk={state.totalCandyInSidewalk}
          continuingPlayerIds={state.continuingPlayerIds}
          onSubmitDecision={onSubmitDecision}
          user={user}
          candyPerPlayer={state.candyPerPlayer}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTrickOrTreat;
