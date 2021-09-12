import React, { Fragment } from 'react';
import clsx from 'clsx';
// Design Resources
import { CaretUpOutlined } from '@ant-design/icons';
// Hooks
import { useDimensions, useLanguage } from '../../hooks';
// Components
import ImageCard from '../../components/cards/ImageCard';
import { translate, Translate } from '../../components/shared';
import { Button, Input, Popover } from 'antd';

function NightmareButton() {
  return (
    <Button disabled className="s-dream-board-entry-nightmare">
      <CaretUpOutlined />
      <Translate pt="Pesadelo" en="Nightmare" />
      <CaretUpOutlined />
    </Button>
  );
}

function DreamButton({ dreamNumber, cardId, clue, previousClues, onClueChange }) {
  const language = useLanguage();

  const title = `${translate('Sonho', 'Dream', language)} ${dreamNumber}`;

  return (
    <Popover
      trigger="click"
      title={title}
      content={
        <DreamCluePopover
          cardId={cardId}
          clue={clue}
          previousClues={previousClues}
          onClueChange={onClueChange}
        />
      }
    >
      <Button block className="s-dream-board-entry-dream">
        {clue ? (
          clue
        ) : (
          <Fragment>
            <CaretUpOutlined />
            {title}
            <CaretUpOutlined />
          </Fragment>
        )}
      </Button>
    </Popover>
  );
}

function DreamCluePopover({ cardId, clue, previousClues, onClueChange }) {
  return (
    <div className="s-dream-clue-popover">
      <Input defaultValue={clue} onChange={onClueChange} data-card={cardId} />

      {Boolean(previousClues.length) && (
        <div className="s-dream-clue-popover__previous-clues">
          <Translate pt="Dicas anteriores" en="Previous Clues" />
          <ol>
            {previousClues.map((pClue, index) => (
              <li className="s-dream-clue-popover__previous-clue" key={`pClue-${cardId}-${index}`}>
                {pClue}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function DreamBoard({ table, user, localClues, setLocalClues }) {
  const [screenWidth] = useDimensions();
  const cardWidth = Math.round(screenWidth / (table.length / 2)) - 32;
  const baseClass = 's-dream-board-card';
  let dreamNumber = 0;

  const onClueChange = ({ target }) => {
    const { value, dataset } = target;

    setLocalClues((s) => {
      const newState = { ...(s ?? {}) };
      newState[dataset.card] = value;

      return newState;
    });
  };

  return (
    <ul className="s-dream-board">
      {table.map((entry) => {
        const isDream = Boolean(user.dreams[entry.cardId]);
        const isNightmare = user.nightmares.includes(entry.cardId);
        if (isDream) {
          dreamNumber++;
        }

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

            {isDream && (
              <DreamButton
                dreamNumber={dreamNumber}
                cardId={entry.cardId}
                clue={localClues?.[entry.cardId] ?? ''}
                previousClues={user.dreams[entry.cardId]}
                onClueChange={onClueChange}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default DreamBoard;
