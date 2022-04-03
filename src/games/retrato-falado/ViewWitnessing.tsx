// Utils
import { TIMES } from './constants';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { TimerBar } from 'components/timers';
import { ViewOr } from 'components/views';
import { MonsterCard } from './MonsterCard';

type ViewWitnessingProps = {
  isUserTheWitness: boolean;
  remainingWitnessingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
  currentMonster: Monster;
};

export function ViewWitnessing({
  isUserTheWitness,
  currentMonster,
  remainingWitnessingTime,
  lines,
  setLines,
}: ViewWitnessingProps) {
  return (
    <ViewOr orCondition={isUserTheWitness}>
      <div className="r-view">
        <Title>
          <Translate pt="Memorize!" en="Memorize!" />
        </Title>
        <TimerBar steps={TIMES.MEMORY} value={remainingWitnessingTime} total={TIMES.MEMORY} />
        <MonsterCard currentMonster={currentMonster} />
      </div>

      <div className="r-view">
        <Title>
          <Translate pt="Aguarde..." en="Please wait..." />
        </Title>
        <Instruction contained>
          <Translate
            pt="A testemunha está tendo um flashback do monstro."
            en="The witness is having a flashback of the monster event now."
          />
        </Instruction>
        <TimerBar steps={TIMES.MEMORY} value={remainingWitnessingTime} total={TIMES.MEMORY} />
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
      </div>
    </ViewOr>
  );
}
