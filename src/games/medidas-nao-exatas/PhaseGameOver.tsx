// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { Card } from 'components/cards';
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { GalleryEntry } from './utils/types';
import achievementsReference from './utils/achievements';
import { MetricsBoard } from './components/MetricsBoard';

export function PhaseGameOver({ state, players }: PhaseProps) {
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
            <Card hideHeader>{entry.cards[entry.secretWordId]?.text || '???'}</Card>
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
