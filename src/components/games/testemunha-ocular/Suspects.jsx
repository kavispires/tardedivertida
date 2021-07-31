import React from 'react';
import { useDimensions, useLanguage } from '../../../hooks';
import { ImageCard } from '../../cards';
import { SUSPECTS_NAMES } from './suspects-names';

export function Suspects({ suspects }) {
  const language = useLanguage();
  const [width] = useDimensions();

  return (
    <div className="t-suspects-table">
      {suspects.map((suspectId) => {
        return (
          <div className="t-suspects-table__suspect" key={suspectId}>
            <ImageCard
              imageId={suspectId}
              className="t-suspects-table__suspect-image"
              cardWidth={Math.floor(width / 7)}
            />
            <div className="t-suspects-table__suspect-name">{SUSPECTS_NAMES[suspectId][language]}</div>
          </div>
        );
      })}
    </div>
  );
}
