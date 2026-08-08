import clsx from 'clsx';
// Ant Design Resources
import { Image } from 'antd';
// Types
import type { SuspectCardData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
// Components
import { SuspectCard } from '@components/cards/SuspectCard';
import { Popconfirm } from '@components/general/Popconfirm';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';

type SuspectsCorkBoardProps = {
  suspectsDict: Dictionary<SuspectCardData>;
  suspectsIds: UID[];
  perpetratorId?: UID;
  onCardClick?: (suspectId: string) => void;
  eliminatedSuspects?: string[];
};

export function SuspectsCorkBoard({
  suspectsDict,
  suspectsIds,
  perpetratorId,
  onCardClick,
  eliminatedSuspects = [],
}: SuspectsCorkBoardProps) {
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
              title={translate({
                pt: `Tem certeza que quer liberar ${name}?`,
                en: `Are you sure you want to release ${name}?`,
              })}
              onConfirm={() => onCardClick(suspect.id)}
              type="yes-no"
              disabled={wasEliminated || isLoading}
            >
              <button
                className="t-suspects-table__suspect t-suspects-table__suspect-button"
                type="button"
                disabled={wasEliminated || isLoading}
              >
                <SuspectEntry
                  suspect={suspect}
                  wasEliminated={wasEliminated}
                  isThePerpetrator={false}
                  cardWidth={cardWidth}
                />
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
              <SuspectEntry
                suspect={suspect}
                wasEliminated={wasEliminated}
                isThePerpetrator={isThePerpetrator}
                cardWidth={cardWidth}
                preview
              />
            </div>
          );
        })}
      </Image.PreviewGroup>
    </div>
  );
}

type SuspectEntryProps = {
  suspect: SuspectCardData;
  wasEliminated: boolean;
  isThePerpetrator: boolean;
  cardWidth: number;
  preview?: boolean;
};

function SuspectEntry({ suspect, wasEliminated, isThePerpetrator, cardWidth, preview }: SuspectEntryProps) {
  return (
    <>
      {wasEliminated ? (
        <ImageCard
          cardId={wasEliminated ? 'us-00' : suspect.id}
          previewImageId={suspect.id}
          className={clsx(
            't-suspects-table__suspect-image',
            isThePerpetrator && 't-suspects-table__suspect-image--active',
          )}
          cardWidth={cardWidth}
          preview={preview}
        />
      ) : (
        <SuspectCard
          suspect={suspect}
          width={cardWidth}
          className={clsx(
            't-suspects-table__suspect-image',
            isThePerpetrator && 't-suspects-table__suspect-image--active',
          )}
          preview={preview}
        />
      )}

      {isThePerpetrator && (
        <span className="t-suspects-table__culprit-badge">
          <Translate
            pt="Culpado"
            en="Culprit"
          />
        </span>
      )}
    </>
  );
}
