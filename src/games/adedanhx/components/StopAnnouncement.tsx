// Types
import type { GamePlayer } from 'types/game';
// Icons
import { StopIcon } from '@icons/StopIcon';
// Components
import { TranslateTemplate } from '@components/language/TranslateTemplate';
import { Surface } from '@components/layout/Surface';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
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
        <Surface>
          <TranslateTemplate
            en="{player} stopped the game! You have <time>5 seconds</time> to finish what you were writing!"
            pt="{player} parou o jogo! Você tem <time>5 segundos</time> pra terminar o que tava escrevendo!"
            values={{
              player: <PlayerAvatarName player={stopper} />,
              time: (content) => <TimeHighlight>{content}</TimeHighlight>,
            }}
          />
        </Surface>
      </PhaseAnnouncement>
      <TimedTimerBar
        duration={12}
        onExpire={onSubmit}
      />
    </>
  );
}
