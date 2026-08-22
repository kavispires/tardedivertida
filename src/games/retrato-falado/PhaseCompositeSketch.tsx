// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useWhichPlayerIsThe } from '@hooks/useWhichPlayerIsThe';
// Icons
import { MonsterIcon } from '@icons/MonsterIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PhaseContainer } from '@components/phases/PhaseContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RoundAnnouncement } from '@components/round/RoundAnnouncement';
import { StepSwitcher } from '@components/steps/StepSwitcher';
// Internal
import { useOnSubmitOrientationAPIRequest, useOnSubmitSketchAPIRequest } from './utils/api-requests';
import { RETRATO_FALADO_PHASES, TIMES } from './utils/constants';
import type { PhaseCompositeSketchState } from './utils/types';
import { StepTestimonial } from './StepTestimonial';

export function PhaseCompositeSketch({ state, players }: PhaseProps<PhaseCompositeSketchState>) {
  const { step, goToNextStep, setStep } = useStep(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);

  const onSubmitSketch = useOnSubmitSketchAPIRequest(setStep);
  const onSubmitOrientation = useOnSubmitOrientationAPIRequest(setStep);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={RETRATO_FALADO_PHASES.COMPOSITE_SKETCH}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <RoundAnnouncement
          round={state?.round}
          onPressButton={goToNextStep}
          buttonText=" "
          time={7}
          unskippable
        >
          <Surface contained>
            <Translate
              pt="Um meliante monstruoso está a solta!
              <br/>
              A testemunha {witness} tentará relembrar o incidente!"
              en="A monstrous miscreant is on the loose!
              <br/>
              The witness {witness} must recall all of its features!"
              values={{
                witness: <PlayerAvatarName player={witness} />,
              }}
            />
          </Surface>
        </RoundAnnouncement>

        {/* Step 1 */}
        <PhaseAnnouncement
          icon={<MonsterIcon />}
          title={
            <Translate
              pt="Memorize! Descreva! Desenhe!"
              en="Memorize! Describe! Sketch!"
            />
          }
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={state?.round?.current < 2 ? 20 : 5}
          unskippable
          type="block"
        >
          <Surface>
            {isUserTheWitness ? (
              <Translate
                pt="Você terá {memoryTime} segundos para memorizar as características do monstro.
                <br/>
                Assim que esse tempo acabar, você terá {sketchTime} minutos para descrevê-lo para os outros jogadores.
                <br/>
                Boa sorte!"
                en="You'll have {memoryTime} seconds to memorize the monster's features.
                <br/>
                When the time is up, you will have {sketchTime} minutes to describe it to the other players.
                <br/>
                Good luck!"
                values={{
                  memoryTime: <TimeHighlight>{TIMES.MEMORY}</TimeHighlight>,
                  sketchTime: <TimeHighlight>{TIMES.SKETCH / 60}</TimeHighlight>,
                }}
              />
            ) : (
              <Translate
                pt="A testemunha {witness} terá {memoryTime} segundos para memorizar as características do monstro.
                <br/>
                Assim que esse tempo acabar, você terá {sketchTime} minutos para desenhá-lo enquanto a testemunha o descreve.
                <br/>
                Boa sorte!"
                en="The witness {witness} will have {memoryTime} seconds to memorize the monster's features.
                <br/>
                When the time is up, you will have {sketchTime}{ minutes to draw the monster while the witness describes it.
                <br/>
                Good luck!"
                values={{
                  witness: <PlayerAvatarName player={witness} />,
                  memoryTime: <TimeHighlight>{TIMES.MEMORY}</TimeHighlight>,
                  sketchTime: <TimeHighlight>{TIMES.SKETCH / 60}</TimeHighlight>,
                }}
              />
            )}
          </Surface>
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
