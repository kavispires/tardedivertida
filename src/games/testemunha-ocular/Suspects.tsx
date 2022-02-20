import clsx from 'clsx';
// Design Resources
import { Popconfirm } from 'antd';
// Hooks
import { useDimensions, useLanguage, useLoading } from '../../hooks';
// Components
import { ImageCard } from '../../components';

type SuspectsProps = {
  suspects: Suspect[];
  perpetrator?: Suspect;
  onCardClick?: GenericFunction;
  eliminatedSuspects?: string[];
};

export function Suspects({ suspects, perpetrator, onCardClick, eliminatedSuspects = [] }: SuspectsProps) {
  const { language, translate } = useLanguage();
  const [isLoading] = useLoading();
  const [width] = useDimensions();

  const cardWidth = Math.floor(width / 7);

  if (onCardClick) {
    return (
      <div className="t-suspects-table">
        {suspects.map((suspect) => {
          const wasEliminated = eliminatedSuspects.includes(suspect.id);
          const name = suspect.name[language];

          return (
            <Popconfirm
              key={suspect.id}
              title={translate(
                `Tem certeza que quer liberar ${name}?`,
                `Are you sure you want to release ${name}?`
              )}
              onConfirm={() => onCardClick(suspect.id)}
              okText={translate('Sim', 'Yes')}
              cancelText={translate('Não', 'No')}
              disabled={wasEliminated || isLoading}
            >
              <button
                className="t-suspects-table__suspect t-suspects-table__suspect-button"
                disabled={wasEliminated || isLoading}
              >
                <ImageCard
                  imageId={wasEliminated ? 'us-00' : suspect.id}
                  className={clsx(
                    't-suspects-table__suspect-image',
                    perpetrator?.id === suspect.id && 't-suspects-table__suspect-image--active',
                    wasEliminated && 't-suspects-table__suspect-image--disabled'
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
      {suspects.map((suspect) => {
        const wasEliminated = eliminatedSuspects.includes(suspect.id);
        return (
          <div className="t-suspects-table__suspect" key={suspect.id}>
            <ImageCard
              imageId={wasEliminated ? 'us-00' : suspect.id}
              className={clsx(
                't-suspects-table__suspect-image',
                perpetrator?.id === suspect.id && 't-suspects-table__suspect-image--active'
              )}
              cardWidth={cardWidth}
            />
            {!wasEliminated && <div className="t-suspects-table__suspect-name">{suspect.name[language]}</div>}
          </div>
        );
      })}
    </div>
  );
}
