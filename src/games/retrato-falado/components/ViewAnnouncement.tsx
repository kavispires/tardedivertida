// Icons
import { SketchIcon } from 'icons/SketchIcon';
import { TimerIcon } from 'icons/TimerIcon';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement } from 'components/phases';

type ViewAnnouncementProps = {
  isUserTheWitness: boolean;
};

export function ViewAnnouncement({ isUserTheWitness }: ViewAnnouncementProps) {
  return (
    <PhaseAnnouncement
      title={
        isUserTheWitness ? (
          <Translate pt="Descreva!" en="Describe!" />
        ) : (
          <Translate pt="Hora de desenhar!" en="Time to draw!" />
        )
      }
      unskippable
      duration={5}
      icon={isUserTheWitness ? <TimerIcon /> : <SketchIcon />}
      onClose={() => {}}
    ></PhaseAnnouncement>
  );
}
