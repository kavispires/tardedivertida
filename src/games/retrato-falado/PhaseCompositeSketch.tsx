import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useLanguage, useWhichPlayerIsThe } from 'hooks';
import { useOnSubmitOrientationAPIRequest, useOnSubmitSketchAPIRequest } from './api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { TIMES } from './constants';
// Components
import {
  AvatarName,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  StepSwitcher,
  Translate,
} from 'components';
import StepTestimonial from './StepTestimonial';

function PhaseCompositeSketch({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitSketch = useOnSubmitSketchAPIRequest(setStep);
  const onSubmitOrientation = useOnSubmitOrientationAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.COMPOSITE_SKETCH}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={() => setStep(1)}
          buttonText=" "
          time={7}
          unskippable
          circleColor="green"
        >
          <Instruction contained>
            <Translate
              pt={
                <>
                  Um meliante monstruoso está a solta!
                  <br />
                  A testemunha <AvatarName player={witness} /> tentará relembrar o incidente!
                </>
              }
              en={
                <>
                  A monstrous miscreant is on the loose!
                  <br />
                  The witness <AvatarName player={witness} /> must recall all of its features!
                </>
              }
            />
          </Instruction>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          type="monster"
          title={translate('Memorize! Descreva! Desenhe!', 'Memorize! Describe! Sketch!')}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 2 ? 20 : 5}
          unskippable
        >
          <Instruction>
            {isUserTheWitness ? (
              <Translate
                pt={
                  <>
                    Você terá {TIMES.MEMORY} segundos para memorizar as características do monstro.
                    <br />
                    Assim que esse tempo acabar, você terá {TIMES.SKETCH / 60} minutos para descrevê-lo para
                    os outros jogadores.
                    <br />
                    Boa sorte!
                  </>
                }
                en={
                  <>
                    You'll have {TIMES.MEMORY} seconds to memorize the monster's features.
                    <br />
                    When the time is up, you will have {TIMES.SKETCH / 60} minutes to describe it to the other
                    players.
                    <br />
                    Good luck!
                  </>
                }
              />
            ) : (
              <Translate
                pt={
                  <>
                    A testemunha <AvatarName player={witness} /> terá {TIMES.MEMORY} segundos para memorizar
                    as características do monstro.
                    <br />
                    Assim que esse tempo acabar, você terá {TIMES.SKETCH / 60} minutos para desenhá-lo
                    enquanto a testemunha o descreve.
                    <br />
                    Boa sorte!
                  </>
                }
                en={
                  <>
                    The witness <AvatarName player={witness} /> will have {TIMES.MEMORY} seconds to memorize
                    the monster's features.
                    <br />
                    When the time is up, you will have {TIMES.SKETCH / 60} minutes to draw the monster while
                    the witness describes it.
                    <br />
                    Good luck!
                  </>
                }
              />
            )}
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 2 */}
        <StepTestimonial
          isUserTheWitness={isUserTheWitness}
          currentMonster={state.currentMonster}
          onSubmitSketch={onSubmitSketch}
          onSubmitOrientation={onSubmitOrientation}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCompositeSketch;
