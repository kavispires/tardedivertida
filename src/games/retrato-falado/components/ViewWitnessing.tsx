// Utils
import { TIMES } from '../utils/constants';
// Components
import { DrawingCanvas } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { TimerBar } from 'components/timers';
import { ViewOr } from 'components/views';
import { MonsterCard } from '../../../components/cards/MonsterCard';
import { AvatarName } from 'components/avatars';

type ViewWitnessingProps = {
  isUserTheWitness: boolean;
  remainingWitnessingTime: number;
  lines: CanvasLine[];
  setLines: CanvasSetLine;
  currentMonster: Monster;
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
    <ViewOr condition={isUserTheWitness}>
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
            pt={
              <>
                A testemunha <AvatarName player={witness} /> está tendo um flashback do monstro.
              </>
            }
            en={
              <>
                The witness <AvatarName player={witness} /> is having a flashback of the monster event now.
              </>
            }
          />
        </Instruction>
        <TimerBar steps={TIMES.MEMORY} value={remainingWitnessingTime} total={TIMES.MEMORY} />
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="small" />
      </div>
    </ViewOr>
  );
}
