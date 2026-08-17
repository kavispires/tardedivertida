// Ant Design Resources
import { Flex } from 'antd';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
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
      <Surface className="i-trap-description mb-2">
        <DualTranslate>{trapEntry.description}</DualTranslate>
      </Surface>
      <Flex justify="center">
        <TrapLevel
          level={trapEntry.level}
          count={3}
        />
      </Flex>
    </PhaseAnnouncement>
  );
}
