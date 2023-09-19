import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement } from 'components/phases';
import { Instruction } from 'components/text';
import { TimedTimerBar } from 'components/timers';
import { StopIcon } from 'icons/StopIcon';

type StopAnnouncementProps = {
  stopper: Player;
  onSubmit: () => void;
};

export function StopAnnouncement({ stopper, onSubmit }: StopAnnouncementProps) {
  return (
    <>
      <PhaseAnnouncement icon={<StopIcon />} title="STOP!" currentRound={1} type="overlay" duration={4}>
        <Instruction>
          <Translate
            pt={
              <>
                <AvatarName player={stopper} /> parou o jogo!
                <br />
                Você tem <TimeHighlight>5 segundos</TimeHighlight> pra terminar o que tava escrevendo!
              </>
            }
            en={
              <>
                <AvatarName player={stopper} /> stopped the game!
                <br />
                You have <TimeHighlight>5 seconds</TimeHighlight> to finish what you were writing!
              </>
            }
          />
        </Instruction>
      </PhaseAnnouncement>
      <TimedTimerBar duration={12} onExpire={onSubmit} />
    </>
  );
}
