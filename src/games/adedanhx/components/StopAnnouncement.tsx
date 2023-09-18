import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TimeHighlight } from 'components/metrics/TimeHighlight';
import { PhaseAnnouncement } from 'components/phases';
import { Instruction } from 'components/text';
import { useLoading } from 'hooks/useLoading';
import { StopIcon } from 'icons/StopIcon';
import { useEffect, useState } from 'react';

type StopAnnouncementProps = {
  stopper: Player;
  timeLeft: number;
  onSubmit: () => void;
};

export function StopAnnouncement({ stopper, onSubmit, timeLeft }: StopAnnouncementProps) {
  const { isLoading } = useLoading();
  const [stoppedAt] = useState(timeLeft);

  useEffect(() => {
    if (!isLoading && timeLeft === stoppedAt) {
      // onSubmit();
      console.log('BOOM!');
    }
  }, [timeLeft, stoppedAt, isLoading]);

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
    </>
  );
}
