// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { DrawingCanvas } from 'components/canvas';
import { MonsterCard } from 'components/cards/MonsterCard';
import { Translate } from 'components/language';
import { RuleInstruction, Title } from 'components/text';
import { TimerBar } from 'components/timers';
import { ViewOr } from 'components/views';
// Internal
import { TIMES } from '../utils/constants';

type ViewSketchingProps = {
  isUserTheWitness: boolean;
  remainingSketchingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
};

export function ViewSketching({
  isUserTheWitness,
  remainingSketchingTime,
  lines,
  setLines,
}: ViewSketchingProps) {
  useTemporarilyHidePlayersBar();
  return (
    <ViewOr condition={isUserTheWitness}>
      <div className="r-view">
        <Title>
          <Translate pt="Descreva o monstro!" en="Describe the monster!" />
        </Title>
        <RuleInstruction type="tip">
          <Translate
            pt="Tente dar o maior número de detalhes possível. Os jogadores podem te fazer perguntas."
            en="Try to give the largest number of details. Player may ask you questions too."
          />
        </RuleInstruction>
        <TimerBar steps={TIMES.SKETCH} value={remainingSketchingTime} total={TIMES.SKETCH} />
        <MonsterCard currentMonster={{ id: 'md-bs-000', orientation: 'vertical' }} showControls={false} />
      </div>

      <div className="r-view">
        <Title>
          <Translate pt="Desenhe!" en="Sketch it!" />
        </Title>
        <RuleInstruction type="tip">
          {remainingSketchingTime > 0 ? (
            <Translate
              pt="Você pode também fazer perguntas à testemunha."
              en="You may also ask the witness questions"
            />
          ) : (
            <Translate pt="Últimos segundos para os retoques finais" en="A few seconds more to finish" />
          )}
        </RuleInstruction>
        <TimerBar steps={TIMES.SKETCH} value={remainingSketchingTime} total={TIMES.SKETCH} />
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
      </div>
    </ViewOr>
  );
}
