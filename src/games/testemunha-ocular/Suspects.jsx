import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Hooks
import { useDimensions, useLanguage, useLoading } from '../../hooks';
// Components
import { ImageCard } from '../../components/cards';
// Utils
import { Popconfirm } from 'antd';
import { translate } from '../../components/shared';

export function Suspects({ suspects, perpetrator, onCardClick, eliminatedSuspects = [] }) {
  const language = useLanguage();
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
                `Are you sure you want to release ${name}?`,
                language
              )}
              onConfirm={() => onCardClick(suspect.id)}
              okText={translate('Sim', 'Yes', language)}
              cancelText={translate('Não', 'No', language)}
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

Suspects.propTypes = {
  eliminatedSuspects: PropTypes.arrayOf(PropTypes.string),
  onCardClick: PropTypes.func,
  perpetrator: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.shape({
      pt: PropTypes.string,
      en: PropTypes.string,
    }),
    gender: PropTypes.string,
  }),
  suspects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.shape({
        pt: PropTypes.string,
        en: PropTypes.string,
      }),
      gender: PropTypes.string,
    })
  ).isRequired,
};
