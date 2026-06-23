// Types
import type { GamePlayer } from 'types/game';
import type { MonsterImageData } from 'types/tdr';
// Components
import { DrawingCanvas } from '@components/canvas/DrawingCanvas';
import { MonsterCard } from '@components/cards/MonsterCard';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { Title } from '@components/text/Title';
import { TimerBar } from '@components/timers/TimerBar';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import { TIMES } from '../utils/constants';

type ViewWitnessingProps = {
  isUserTheWitness: boolean;
  remainingWitnessingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
  currentMonster: MonsterImageData;
  witness: GamePlayer;
};

export function ViewWitnessing({
  isUserTheWitness,
  currentMonster,
  remainingWitnessingTime,
  lines,
  setLines,
  witness,
}: ViewWitnessingProps) {
  return (
    <>
      <ViewIf condition={isUserTheWitness}>
        <div className="r-view">
          <Title>
            <Translate
              pt="Memorize!"
              en="Memorize!"
            />
          </Title>
          <TimerBar
            steps={TIMES.MEMORY}
            value={remainingWitnessingTime}
            total={TIMES.MEMORY}
          />
          <MonsterCard currentMonster={currentMonster} />
        </div>
      </ViewIf>
      <ViewIf condition={!isUserTheWitness}>
        <div className="r-view">
          <Title>
            <Translate
              pt="Aguarde..."
              en="Please wait..."
            />
          </Title>
          <RuleInstruction type="wait">
            <Translate
              pt={
                <>
                  A testemunha <PlayerAvatarName player={witness} /> está tendo um flashback do monstro.
                </>
              }
              en={
                <>
                  The witness <PlayerAvatarName player={witness} /> is having a flashback of the monster event
                  now.
                </>
              }
            />
          </RuleInstruction>
          <TimerBar
            steps={TIMES.MEMORY}
            value={remainingWitnessingTime}
            total={TIMES.MEMORY}
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
