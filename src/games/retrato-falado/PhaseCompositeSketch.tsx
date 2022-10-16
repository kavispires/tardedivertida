// State & Hooks
import { useIsUserReady } from 'hooks/useIsUserReady';
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
import { useOnSubmitOrientationAPIRequest, useOnSubmitSketchAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
import { TIMES } from './utils/constants';
// Components

import { StepTestimonial } from './StepTestimonial';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { RoundAnnouncement } from 'components/round';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';
import { MonsterIcon } from 'components/icons/MonsterIcon';

function PhaseCompositeSketch({ players, state, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(0);
  const isUserReady = useIsUserReady(players, state);
  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitSketch = useOnSubmitSketchAPIRequest(setStep);
  const onSubmitOrientation = useOnSubmitOrientationAPIRequest(setStep);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.RETRATO_FALADO.COMPOSITE_SKETCH}>
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady, !isUserReady]} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={7}
          unskippable
          circleColor={info?.appearance?.color}
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
          icon={<MonsterIcon />}
          title={translate('Memorize! Descreva! Desenhe!', 'Memorize! Describe! Sketch!')}
          onClose={goToNextStep}
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
