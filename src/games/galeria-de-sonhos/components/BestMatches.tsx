import { orderBy } from 'lodash';
// Ant Design Resources
import { Avatar, Divider } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Title } from 'components/text';
// Internal
import type { ImageCardMatch } from '../utils/types';

type BestMatchesProps = {
  bestMatches: ImageCardMatch[];
};

export function BestMatches({ bestMatches }: BestMatchesProps) {
  const cardWidth = useCardWidth(8, { gap: 8, minWidth: 100, maxWidth: 150 });

  return (
    <Step>
      <Divider />
      <Title size="x-small" level={3}>
        <Translate pt="Sonhos mais visitados" en="Most visited dreams" />
      </Title>

      <ul className="g-best-matches">
        {orderBy(bestMatches, 'matchedPlayers.length', 'desc').map((entry, index) => {
          return (
            <div key={`${entry.id}-${index}`} className="g-best-matches__entry">
              <div className="g-best-matches__label">
                <Avatar size="small">{entry.matchedPlayers.length}</Avatar>
                <span>{entry.text}</span>
              </div>
              <ImageCard
                cardId={entry.id}
                cardWidth={cardWidth - 6} // 6 is the border total size
              />
            </div>
          );
        })}
      </ul>
    </Step>
  );
}
