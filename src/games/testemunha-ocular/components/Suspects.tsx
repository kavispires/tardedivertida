import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Types
import type { SuspectCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';

type SuspectsProps = {
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  perpetratorId?: CardId;
  onCardClick?: (suspectId: string) => void;
  eliminatedSuspects?: string[];
};

export function Suspects({
  suspectsDict,
  suspectsIds,
  perpetratorId,
  onCardClick,
  eliminatedSuspects = [],
}: SuspectsProps) {
  const { language, translate } = useLanguage();
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(7, { maxWidth: 128 });

  if (onCardClick) {
    return (
      <div className="t-suspects-table">
        {suspectsIds.map((suspectId) => {
          const suspect = suspectsDict[suspectId];
          const wasEliminated = eliminatedSuspects.includes(suspect.id);
          const name = suspect.name[language];

          return (
            <Popconfirm
              key={suspect.id}
              title={translate(
                `Tem certeza que quer liberar ${name}?`,
                `Are you sure you want to release ${name}?`,
              )}
              onConfirm={() => onCardClick(suspect.id)}
              type="yes-no"
              disabled={wasEliminated || isLoading}
            >
              <button
                className="t-suspects-table__suspect t-suspects-table__suspect-button"
                type="button"
                disabled={wasEliminated || isLoading}
              >
                <ImageCard
                  cardId={wasEliminated ? 'us-00' : suspect.id}
                  className={clsx(
                    't-suspects-table__suspect-image',
                    wasEliminated && 't-suspects-table__suspect-image--disabled',
                  )}
                  cardWidth={cardWidth}
                  preview={false}
                />
                {!wasEliminated && <div className="t-suspects-table__suspect-name">{name}</div>}
              </button>
            </Popconfirm>
          );
        })}
      </div>
    );
  }

  return (
    <div className="t-suspects-table">
      <Image.PreviewGroup>
        {suspectsIds.map((suspectId) => {
          const suspect = suspectsDict[suspectId];
          const wasEliminated = eliminatedSuspects.includes(suspect.id);
          const isThePerpetrator = perpetratorId === suspect.id;
          return (
            <div
              className="t-suspects-table__suspect"
              key={suspect.id}
            >
              <ImageCard
                cardId={wasEliminated ? 'us-00' : suspect.id}
                previewImageId={suspect.id}
                className={clsx(
                  't-suspects-table__suspect-image',
                  isThePerpetrator && 't-suspects-table__suspect-image--active',
                )}
                cardWidth={cardWidth}
              />
              {isThePerpetrator && (
                <span className="t-suspects-table__culprit-badge">
                  <Translate
                    pt="Culpado"
                    en="Culprit"
                  />
                </span>
              )}
              {!wasEliminated && (
                <div className="t-suspects-table__suspect-name">
                  <DualTranslate>{suspect.name}</DualTranslate>
                </div>
              )}
            </div>
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
}
