// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { Translate } from 'components/language';
import { PhaseAnnouncement } from 'components/phases';
import { Instruction } from 'components/text';
// Internal
import { getTrapDetails } from '../utils/helpers';

type TrapAnnouncementProps = {
  trap: string;
  goToNextStep: UseStep['goToNextStep'];
};

export function TrapAnnouncement({ trap, goToNextStep }: TrapAnnouncementProps) {
  const { title, description, TrapIcon } = getTrapDetails(trap);
  return (
    <PhaseAnnouncement
      icon={<TrapIcon />}
      title={<Translate pt={title.pt} en={title.en} />}
      onClose={goToNextStep}
      duration={10}
      unskippable
      type="block"
    >
      <Instruction className="i-trap-description">
        <Translate pt={description.pt} en={description.en} />
      </Instruction>
    </PhaseAnnouncement>
  );
}
