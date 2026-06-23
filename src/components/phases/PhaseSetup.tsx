import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useGameId } from '@hooks/useGameId';
import { useGameMeta } from '@hooks/useGameMeta';
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { PHASES } from '@utils/phases';
// Icons
import { AnimatedGearIcon } from '@icons/AnimatedGearIcon';
// Components
import { Translate } from '@components/language/Translate';
import { Instruction } from '@components/text/Instruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import { PhaseContainer } from './PhaseContainer';
import { VideoBackground } from './lobby/VideoBackground';
import { ImageBackground } from './lobby/ImageBackground';
// Sass
import styles from './PhaseAnnouncement.module.scss';

const SETUP_PHRASES = [
  {
    pt: 'Carregando os dados...',
    en: 'Gathering resources...',
  },
  {
    pt: 'Preparando a diversão...',
    en: 'Preparing the fun...',
  },
  {
    pt: 'Escolhendo quem o servidor vai roubar pra ganhar...',
    en: 'Choosing who the server will rig the game for...',
  },
  {
    pt: 'Quase lá...',
    en: 'Almost there...',
  },
];

/**
 * Phase component that displays a setup screen while the game initializes
 */
export function PhaseSetup({ state }: PhaseProps) {
  const gameId = useGameId();
  const queryClient = useQueryClient();
  const { dataUpdatedAt } = useGameMeta();
  const { translate } = useLanguage();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only the id matters
  useEffect(() => {
    if (dataUpdatedAt > 0 && gameId) {
      queryClient.invalidateQueries({ queryKey: ['meta', gameId] });
    }
  }, [gameId]);

  // Rotate phrases every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % SETUP_PHRASES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PHASES.DEFAULT.SETUP}
      className="setup"
    >
      <div
        className={styles.phaseAnnouncement}
        style={{ zIndex: 3, background: 'transparent' }}
      >
        <StepTitle colorScheme="dark">
          <Translate
            pt="Preparando o jogo..."
            en="Setting up..."
          />
        </StepTitle>

        <AnimatedGearIcon className={styles.phaseAnnouncementIcon} />

        <Instruction style={{ color: 'white' }}>{translate(SETUP_PHRASES[currentPhraseIndex])}</Instruction>
      </div>
      <VideoBackground />

      <ImageBackground />
    </PhaseContainer>
  );
}
