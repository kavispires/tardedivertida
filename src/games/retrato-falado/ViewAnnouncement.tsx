import { Translate } from 'components';
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
      type={isUserTheWitness ? 'timer' : 'sketch'}
      onClose={() => {}}
    ></PhaseAnnouncement>
  );
}
