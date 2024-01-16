// Ant Design Resources
import { Tooltip } from 'antd';
// Types
import type { ExtendedObjectFeatureCard, HistoryEntry } from '../utils/types';
// Images
import featuresIcons from './feature-icons.svg';
// Icons
import { BoxQuestionMarkIcon } from 'icons/BoxQuestionMarkIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxBlankIcon } from 'icons/BoxBlankIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';

type ScoreTrackProps = {
  history: HistoryEntry[];
  features: Dictionary<ExtendedObjectFeatureCard>;
};

export function ScoreTrack({ history, features }: ScoreTrackProps) {
  return (
    <Tooltip
      title={
        <Translate
          en={
            <>
              From left to write, this is how many features we have to eliminate and how many points we get
              for each one.
              <br />
              As you can see, we must eliminate some before we even get any points.
            </>
          }
          pt={
            <>
              Da esquerda para a direita, este é o número de características que temos que eliminar e quantos
              pontos ganhamos para cada uma delas.
              <br />
              Como você pode ver, temos que eliminar algumas antes mesmo de ganhar pontos.
            </>
          }
        />
      }
    >
      <div className="score-track" style={{ gridTemplateColumns: `repeat(${history.length}, 1fr)` }}>
        {history.map((entry, index) => (
          <div key={index} className="score-track__item">
            <div className="score-track__item-icon">
              {entry.featureId ? (
                <IconAvatar
                  icon={
                    <svg viewBox="0 0 512 512">
                      <use href={featuresIcons + `#${entry.featureId}`}></use>
                    </svg>
                  }
                  size="small"
                />
              ) : (
                <IconAvatar icon={<BoxQuestionMarkIcon />} size="small" />
              )}
              <div className="score-track__item-score">
                {entry.score}
                {/* <PointsHighlight>{entry.score}</PointsHighlight> */}
              </div>
              {entry.featureId ? (
                <IconAvatar icon={<BoxCheckMarkIcon />} size="small" />
              ) : (
                <IconAvatar icon={<BoxBlankIcon />} size="small" className="invisible" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Tooltip>
  );
}
