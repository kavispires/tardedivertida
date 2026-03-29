// Types
import type { GamePlayer } from 'types/game';
import type { MonsterImage } from 'types/tdr';
// Components
import { DrawingCanvas } from 'components/canvas';
import { MonsterCard } from 'components/cards/MonsterCard';
import { Translate } from 'components/language';
import { PlayerAvatarName } from 'components/player';
import { RuleInstruction, Title } from 'components/text';
import { TimerBar } from 'components/timers';
import { ViewIf } from 'components/views';
// Internal
import { TIMES } from '../utils/constants';

type ViewWitnessingProps = {
  isUserTheWitness: boolean;
  remainingWitnessingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
  currentMonster: MonsterImage;
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
