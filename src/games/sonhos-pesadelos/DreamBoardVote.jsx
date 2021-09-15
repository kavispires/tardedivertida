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
import Ribbon from '../arte-ruim/Ribbon';
import { getEntryId } from '../../utils';

function DreamButton() {
  return (
    <Button disabled className="s-dream-board-entry-dream">
      <CaretUpOutlined />
      <Translate pt="Sonho" en="Dream" />
      <CaretUpOutlined />
    </Button>
  );
}

function SelectButton({ onActivateItem, cardEntryId }) {
  return (
    <Button ghost block size="small" onClick={() => onActivateItem(cardEntryId)}>
      <CaretUpOutlined />
      <Translate pt="Selecionar" en="Select" />
      <CaretUpOutlined />
    </Button>
  );
}

const getClueId = (votes, cardEntryId) => {
  return Object.keys(votes).find((key) => votes[key] === cardEntryId);
};

function DreamBoardVote({ table, user, activeItem, onActivateItem, votes }) {
  const [screenWidth] = useDimensions();
  const cardWidth = Math.round(screenWidth / (table.length / 2)) - 40;
  const baseClass = 's-dream-board-card';
  const liButtonBaseClass = 'a-evaluation-all-drawings__li-drawing-button';

  return (
    <ul className="s-dream-board">
      {table.map((entry) => {
        const isDream = Boolean(user.dreams[entry.cardId]);
        const isNightmare = user.nightmares.includes(entry.cardId);
        const cardEntryId = getEntryId(['card', entry.cardId]);
        const isActive = activeItem === cardEntryId;
        const ribbonId = getClueId(votes, cardEntryId);

        return (
          <li
            className={clsx(
              's-dream-board-entry',
              liButtonBaseClass,
              isActive && `${liButtonBaseClass}--active`
            )}
            key={`board-${entry.cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            {ribbonId && <Ribbon cardEntryId={ribbonId} />}
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
            {isDream ? (
              <DreamButton />
            ) : (
              <SelectButton cardEntryId={cardEntryId} onActivateItem={onActivateItem} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default DreamBoardVote;
