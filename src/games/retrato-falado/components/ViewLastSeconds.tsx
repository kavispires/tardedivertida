// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { RuleInstruction, Title } from 'components/text';
import { TimerBar } from 'components/timers';
import { ViewOr } from 'components/views';
// Internal
import { TIMES } from '../utils/constants';

type ViewSketchingProps = {
  isUserTheWitness: boolean;
  remainingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
};

export function ViewLastSeconds({ isUserTheWitness, remainingTime, lines, setLines }: ViewSketchingProps) {
  useTemporarilyHidePlayersBar();

  return (
    <ViewOr condition={isUserTheWitness}>
      <div className="r-view">
        <Title>
          <Translate
            pt="Pronto!"
            en="Done! "
          />
        </Title>
        <TimerBar
          steps={TIMES.EXTRA}
          value={remainingTime}
          total={TIMES.EXTRA}
          strokeColor="red"
        />
        <RuleInstruction type="event">
          <Translate
            pt="Boca fechada! Aguarde os jogadores darem os últimos retoques."
            en="Shut up! Wait for the other players to finish their drawings."
          />
        </RuleInstruction>
      </div>

      <div className="r-view">
        <Title>
          <Translate
            pt="Termine!"
            en="Finish it!"
          />
        </Title>
        <RuleInstruction type="event">
          <Translate
            pt="Últimos segundos para os retoques finais"
            en="A few seconds more to finish"
          />
        </RuleInstruction>
        <TimerBar
          steps={TIMES.EXTRA}
          value={remainingTime}
          total={TIMES.EXTRA}
          strokeColor="red"
        />
        <DrawingCanvas
          lines={lines}
          setLines={setLines}
          showControls
          strokeWidth="small"
        />
      </div>
    </ViewOr>
  );
}
