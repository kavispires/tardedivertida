// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { DrawingCanvas } from 'components/canvas/DrawingCanvas';
import { Translate } from 'components/language/Translate';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { Title } from 'components/text/Title';
import { TimerBar } from 'components/timers/TimerBar';
import { ViewIf } from 'components/views/ViewIf';
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
    <>
      <ViewIf condition={isUserTheWitness}>
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
      </ViewIf>
      <ViewIf condition={!isUserTheWitness}>
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
      </ViewIf>
    </>
  );
}
