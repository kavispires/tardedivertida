import { PhaseAnnouncement, Translate } from '../../components/shared';

type ViewAnnouncementProps = {
  isUserTheWitness: boolean;
};

function ViewAnnouncement({ isUserTheWitness }: ViewAnnouncementProps) {
  return (
    <PhaseAnnouncement
      title={
        isUserTheWitness ? (
          <Translate pt="Memorize!" en="Memorize!" />
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

export default ViewAnnouncement;
