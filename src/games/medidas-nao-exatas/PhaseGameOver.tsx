// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import type { GalleryEntry, PhaseGameOverState } from './utils/types';
import achievementsReference from './utils/achievements';
import { MetricsBoard } from './components/MetricsBoard';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const gallery: GalleryEntry[] = state.gallery ?? [];

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <TitledContainer
        title={
          <Translate
            pt="Métricas"
            en="Metrics"
          />
        }
        className="mt-4"
      >
        {gallery.map((entry) => (
          <Flex
            key={entry.secretWordId}
            vertical
            align="center"
            justify="center"
          >
            <TextCard>{entry.cards[entry.secretWordId]?.text || '???'}</TextCard>
            <MetricsBoard
              metricsDescriptors={entry.metricsDescriptors}
              evaluations={entry.metrics}
              level={5}
            />
          </Flex>
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
