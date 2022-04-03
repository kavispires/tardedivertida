// Utils
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { TimerBar } from 'components/timers';
import { ViewOr } from 'components/views';
import { TIMES } from './constants';
// Components

type ViewSketchingProps = {
  isUserTheWitness: boolean;
  remainingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
};

export function ViewLastSeconds({ isUserTheWitness, remainingTime, lines, setLines }: ViewSketchingProps) {
  return (
    <ViewOr orCondition={isUserTheWitness}>
      <div className="r-view">
        <Title>
          <Translate pt="Pronto!" en="Done! " />
        </Title>
        <TimerBar steps={TIMES.EXTRA} value={remainingTime} total={TIMES.EXTRA} strokeColor="red" />
        <Instruction contained>
          <Translate
            pt="Boca fechada! Aguarde os jogadores darem os últimos retoques."
            en="Shut up! Wait for the other players to finish their drawings."
          />
        </Instruction>
      </div>

      <div className="r-view">
        <Title>
          <Translate pt="Termine!" en="Finish it!" />
        </Title>
        <Instruction contained>
          <Translate pt="Últimos segundos para os retoques finais" en="A few seconds more to finish" />
        </Instruction>
        <TimerBar steps={TIMES.EXTRA} value={remainingTime} total={TIMES.EXTRA} strokeColor="red" />
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
      </div>
    </ViewOr>
  );
}
