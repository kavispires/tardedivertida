// Types
import type { GamePlayer } from 'types/game';
// Icons
import { StopIcon } from '@icons/StopIcon';
// Components
import { Translate } from '@components/language/Translate';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Instruction } from '@components/text/Instruction';
import { TimedTimerBar } from '@components/timers/TimedTimerBar';

type StopAnnouncementProps = {
  stopper: GamePlayer;
  onSubmit: () => void;
};

export function StopAnnouncement({ stopper, onSubmit }: StopAnnouncementProps) {
  return (
    <>
      <PhaseAnnouncement
        icon={<StopIcon />}
        title="STOP!"
        currentRound={1}
        type="overlay"
        duration={4}
      >
        <Instruction>
          <Translate
            pt={
              <>
                <PlayerAvatarName player={stopper} /> parou o jogo!
                <br />
                Você tem <TimeHighlight>5 segundos</TimeHighlight> pra terminar o que tava escrevendo!
              </>
            }
            en={
              <>
                <PlayerAvatarName player={stopper} /> stopped the game!
                <br />
                You have <TimeHighlight>5 seconds</TimeHighlight> to finish what you were writing!
              </>
            }
          />
        </Instruction>
      </PhaseAnnouncement>
      <TimedTimerBar
        duration={12}
        onExpire={onSubmit}
      />
    </>
  );
}
