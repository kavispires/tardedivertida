// Ant Design Resources
import { Flex } from 'antd';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { DualTranslate } from 'components/language';
import { PhaseAnnouncement } from 'components/phases';
import { Instruction } from 'components/text';
// Internal
import type { TrapEntry } from '../utils/types';
import { getTrapIcon } from '../utils/helpers';
import { TrapLevel } from './TrapLevel';

type TrapAnnouncementProps = {
  trapEntry: TrapEntry | null;
  goToNextStep: UseStep['goToNextStep'];
};

export function TrapAnnouncement({ trapEntry, goToNextStep }: TrapAnnouncementProps) {
  if (!trapEntry) return null;

  const Icon = getTrapIcon(trapEntry.icon);

  return (
    <PhaseAnnouncement
      icon={<Icon />}
      title={<DualTranslate>{trapEntry.title}</DualTranslate>}
      onClose={goToNextStep}
      duration={10}
      unskippable
      type="block"
    >
      <Instruction className="i-trap-description">
        <DualTranslate>{trapEntry.description}</DualTranslate>
      </Instruction>
      <Flex justify="center">
        <TrapLevel level={trapEntry.level} count={3} />
      </Flex>
    </PhaseAnnouncement>
  );
}
