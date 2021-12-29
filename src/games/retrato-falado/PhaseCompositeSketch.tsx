import { useState } from 'react';
// State & Hooks
import { useIsUserReady, useAPICall, useLanguage, useWhichPlayerIsThe } from '../../hooks';
// Resources & Utils
import { RETRATO_FALADO_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  AvatarName,
  WaitingRoom,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Step,
  StepSwitcher,
  translate,
  Translate,
} from '../../components';
import StepTestimonial from './StepTestimonial';
import { TIMES } from './constants';

function PhaseCompositeSketch({ players, state, info }: PhaseProps) {
  const language = useLanguage();

  const isUserReady = useIsUserReady(players, state);
  const [step, setStep] = useState(0);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitSketchAPIRequest = useAPICall({
    apiFunction: RETRATO_FALADO_API.submitAction,
    actionName: 'submit-sketch',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate(
      'Acabou o tempo! Desenho enviado com sucesso',
      "Time's up! Sketch submitted successfully",
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
      'Oops, the application failed to send your sketch',
      language
    ),
  });

  const onSubmitSketch = (payload: any) => {
    onSubmitSketchAPIRequest({
      action: 'SUBMIT_SKETCH',
      ...payload,
    });
  };

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.COMPOSITE_SKETCH}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={() => setStep(1)}
          buttonText=" "
          time={7}
          unskippable
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
          title={translate('Memorize! Descreva! Desenhe!', 'Memorize! Describe! Sketch!', language)}
          onClose={() => setStep(2)}
          currentRound={state?.round?.current}
          duration={20}
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
        />

        {/* Step 3 */}
        <Step fullWidth>
          <WaitingRoom players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseCompositeSketch;
