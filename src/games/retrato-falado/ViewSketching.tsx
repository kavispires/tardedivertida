// Utils
import { TIMES } from './constants';
// Components
import { DrawingCanvas } from '../../components/canvas';
import { Instruction, TimerBar, Title, Translate } from '../../components/shared';
import MonsterCard from './MonsterCard';

type ViewSketchingProps = {
  isUserTheWitness: boolean;
  remainingSketchingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
};

function ViewSketching({ isUserTheWitness, remainingSketchingTime, lines, setLines }: ViewSketchingProps) {
  return isUserTheWitness ? (
    <div className="r-view">
      <Title>
        <Translate pt="Descreva o monstro!" en="Describe the monstro!" />
      </Title>
      <TimerBar steps={TIMES.SKETCH} value={remainingSketchingTime} total={TIMES.SKETCH} />
      <MonsterCard currentMonster={{ id: 'md-bs-000', orientation: 'vertical' }} showControls={false} />
      <Instruction contained>
        <Translate
          pt="Tente dar o maior número de detalhes possível. Os jogadores podem te fazer perguntas."
          en="Try to give the largest number of details. Player may ask you questions too."
        />
      </Instruction>
    </div>
  ) : (
    <div className="r-view">
      <Title>
        <Translate pt="Desenhe!" en="Sketch it!" />
      </Title>
      <Instruction contained>
        {remainingSketchingTime > 0 ? (
          <Translate
            pt="Você pode também fazer perguntas à testemunha."
            en="You may also ask questions to the witness"
          />
        ) : (
          <Translate pt="Últimos segundos para os retoques finais" en="A few seconds more to finish" />
        )}
      </Instruction>
      <TimerBar steps={TIMES.SKETCH} value={remainingSketchingTime} total={TIMES.SKETCH} />
      <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
    </div>
  );
}
export default ViewSketching;
