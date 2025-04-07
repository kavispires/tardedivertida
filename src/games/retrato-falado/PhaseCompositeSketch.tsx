// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { MonsterIcon } from 'icons/MonsterIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { RoundAnnouncement } from 'components/round';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnSubmitOrientationAPIRequest, useOnSubmitSketchAPIRequest } from './utils/api-requests';
import { RETRATO_FALADO_PHASES, TIMES } from './utils/constants';
import { StepTestimonial } from './StepTestimonial';

export function PhaseCompositeSketch({ players, state }: PhaseProps) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitSketch = useOnSubmitSketchAPIRequest(setStep);
  const onSubmitOrientation = useOnSubmitOrientationAPIRequest(setStep);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={RETRATO_FALADO_PHASES.COMPOSITE_SKETCH}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={7}
          unskippable
        >
          <Instruction contained>
            <Translate
              pt={
                <>
                  Um meliante monstruoso está a solta!
                  <br />A testemunha <AvatarName player={witness} /> tentará relembrar o incidente!
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
          title={<Translate pt="Memorize! Descreva! Desenhe!" en="Memorize! Describe! Sketch!" />}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 2 ? 20 : 5}
          unskippable
          type="block"
        >
          <Instruction>
            {isUserTheWitness ? (
              <Translate
                pt={
                  <>
                    Você terá <TimeHighlight>{TIMES.MEMORY}</TimeHighlight> segundos para memorizar as
                    características do monstro.
                    <br />
                    Assim que esse tempo acabar, você terá <TimeHighlight>{TIMES.SKETCH / 60}</TimeHighlight>{' '}
                    minutos para descrevê-lo para os outros jogadores.
                    <br />
                    Boa sorte!
                  </>
                }
                en={
                  <>
                    You'll have <TimeHighlight>{TIMES.MEMORY}</TimeHighlight> seconds to memorize the
                    monster's features.
                    <br />
                    When the time is up, you will have <TimeHighlight>{TIMES.SKETCH / 60}</TimeHighlight>{' '}
                    minutes to describe it to the other players.
                    <br />
                    Good luck!
                  </>
                }
              />
            ) : (
              <Translate
                pt={
                  <>
                    A testemunha <AvatarName player={witness} /> terá{' '}
                    <TimeHighlight>{TIMES.MEMORY}</TimeHighlight> segundos para memorizar as características
                    do monstro.
                    <br />
                    Assim que esse tempo acabar, você terá <TimeHighlight>{TIMES.SKETCH / 60}</TimeHighlight>{' '}
                    minutos para desenhá-lo enquanto a testemunha o descreve.
                    <br />
                    Boa sorte!
                  </>
                }
                en={
                  <>
                    The witness <AvatarName player={witness} /> will have{' '}
                    <TimeHighlight>{TIMES.MEMORY}</TimeHighlight> seconds to memorize the monster's features.
                    <br />
                    When the time is up, you will have <TimeHighlight>{TIMES.SKETCH / 60}</TimeHighlight>{' '}
                    minutes to draw the monster while the witness describes it.
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
          witness={witness}
          currentMonster={state.currentMonster}
          onSubmitSketch={onSubmitSketch}
          onSubmitOrientation={onSubmitOrientation}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
