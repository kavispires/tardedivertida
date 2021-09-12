import React from 'react';
import clsx from 'clsx';
// Design Resources
import { CaretUpOutlined } from '@ant-design/icons';
// Hooks
import { useDimensions } from '../../hooks';
// Components
import ImageCard from '../../components/cards/ImageCard';
import { Translate } from '../../components/shared';
import { Button } from 'antd';

function NightmareButton() {
  return (
    <Button disabled className="s-dream-board-entry-nightmare">
      <CaretUpOutlined />
      <Translate pt="Pesadelo" en="Nightmare" />
      <CaretUpOutlined />
    </Button>
  );
}

function DreamButton() {
  return (
    <Button disabled className="s-dream-board-entry-dream">
      <CaretUpOutlined />
      <Translate pt="Sonho" en="Dream" />
      <CaretUpOutlined />
    </Button>
  );
}

function DreamBoard({ table, user }) {
  const [screenWidth] = useDimensions();
  const cardWidth = Math.round(screenWidth / (table.length / 2)) - 32;
  const baseClass = 's-dream-board-card';

  return (
    <ul className="s-dream-board">
      {table.map((entry) => {
        const isDream = Boolean(user.dreams[entry.cardId]);
        const isNightmare = user.nightmares.includes(entry.cardId);

        return (
          <li
            className="s-dream-board-entry"
            key={`board-${entry.cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <ImageCard
              imageId={entry.cardId}
              bordered
              cardWidth={cardWidth}
              className={clsx(
                baseClass,
                isDream && `${baseClass}--dream`,
                isNightmare && `${baseClass}--nightmare`
              )}
            />
            {isNightmare && <NightmareButton />}

            {isDream && <DreamButton />}
          </li>
        );
      })}
    </ul>
  );
}

export default DreamBoard;
