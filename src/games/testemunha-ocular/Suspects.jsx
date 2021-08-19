import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Hooks
import { useDimensions, useLanguage, useLoading } from '../../hooks';
// Components
import { ImageCard } from '../../components/cards';
// Utils
import { SUSPECTS_NAMES } from './suspects-names';

export function Suspects({ suspects, perpetrator, onCardClick, eliminatedSuspects = [] }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [width] = useDimensions();

  const cardWidth = Math.floor(width / 7);

  if (onCardClick) {
    return (
      <div className="t-suspects-table">
        {suspects.map((suspectId) => {
          const wasEliminated = eliminatedSuspects.includes(suspectId);
          return (
            <button
              className="t-suspects-table__suspect t-suspects-table__suspect-button"
              key={suspectId}
              onClick={() => onCardClick(suspectId)}
              disabled={wasEliminated || isLoading}
            >
              <ImageCard
                imageId={wasEliminated ? 'us-00' : suspectId}
                className={clsx(
                  't-suspects-table__suspect-image',
                  perpetrator === suspectId && 't-suspects-table__suspect-image--active',
                  wasEliminated && 't-suspects-table__suspect-image--disabled'
                )}
                cardWidth={cardWidth}
                preview={false}
              />
              {!wasEliminated && (
                <div className="t-suspects-table__suspect-name">{SUSPECTS_NAMES[suspectId][language]}</div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="t-suspects-table">
      {suspects.map((suspectId) => {
        const wasEliminated = eliminatedSuspects.includes(suspectId);
        return (
          <div className="t-suspects-table__suspect" key={suspectId}>
            <ImageCard
              imageId={wasEliminated ? 'us-00' : suspectId}
              className={clsx(
                't-suspects-table__suspect-image',
                perpetrator === suspectId && 't-suspects-table__suspect-image--active'
              )}
              cardWidth={cardWidth}
            />
            {!wasEliminated && (
              <div className="t-suspects-table__suspect-name">{SUSPECTS_NAMES[suspectId][language]}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Suspects.propTypes = {
  eliminatedSuspects: PropTypes.arrayOf(PropTypes.string),
  onCardClick: PropTypes.func,
  perpetrator: PropTypes.string,
  suspects: PropTypes.arrayOf(PropTypes.string),
};
