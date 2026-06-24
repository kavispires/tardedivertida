// Types
import type { PhaseProps } from 'types/game';
// Utils
import { PHASES } from '@utils/phases';
// Icons
import { AnimatedProcessingIcon } from '@icons/AnimatedProcessingIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { Title } from '@components/text/Title';
// Internal
import { PhaseContainer } from './PhaseContainer';
// Sass
import styles from './PhaseAnnouncement.module.scss';

/**
 * Phase component that displays a waiting screen while the game transitions between phases
 */
export function PhaseWait({ state }: PhaseProps) {
  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PHASES.DEFAULT.WAIT}
      className="setup"
    >
      <div className={styles.phaseAnnouncement}>
        <Title>
          <Translate
            pt="Processando..."
            en="Processing..."
          />
        </Title>

        <AnimatedProcessingIcon className={styles.phaseAnnouncementIcon} />

        <Surface>
          <Translate
            pt="Aguarde um momento"
            en="Just a moment"
          />
        </Surface>
      </div>
    </PhaseContainer>
  );
}
