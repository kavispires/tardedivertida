// Design Resources
import { Button, Input, Popover } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
// Hooks
import { useCardWidth, useLanguage } from '../../hooks';
// Utils
import { shouldDisplayCard } from './helpers';
// Components
import { Translate } from '../../components';
import { NightmareButton } from './NightmareButton';
import { DreamCard } from './DreamCard';

type DreamButtonProps = {
  cardId: string;
  clue: string;
  previousClues: string[];
  onClueChange: GenericFunction;
};

function DreamButton({ cardId, clue, previousClues, onClueChange }: DreamButtonProps) {
  const { translate } = useLanguage();

  const title = `${translate('Sonho', 'Dream')}`;

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
          <>
            <CaretUpOutlined />
            {title}
            <CaretUpOutlined />
          </>
        )}
      </Button>
    </Popover>
  );
}

type DreamCluePopoverProps = {
  cardId: string;
  clue: string;
  previousClues: string[];
  onClueChange: GenericFunction;
};

function DreamCluePopover({ cardId, clue, previousClues, onClueChange }: DreamCluePopoverProps) {
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

type DreamBoardWriteProps = {
  table: STable;
  user: GamePlayer;
  localClues: PlainObject;
  setLocalClues: GenericFunction;
  currentRound: number;
};

export function DreamBoardWrite({
  table,
  user,
  localClues,
  setLocalClues,
  currentRound,
}: DreamBoardWriteProps) {
  const cardWidth = useCardWidth(table.length / 2, 40);

  const onClueChange = ({ target }: any) => {
    const { value, dataset } = target;

    setLocalClues((s: any) => {
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

        return (
          <li
            className="s-dream-board-entry"
            key={`board-${entry.cardId}`}
            style={{ maxWidth: `${cardWidth + 20}px` }}
          >
            <DreamCard
              cardId={entry.cardId}
              cardWidth={cardWidth}
              flipped={!shouldDisplayCard(currentRound, entry, user.id)}
              isDream={isDream}
              isNightmare={isNightmare}
            />

            {isNightmare && <NightmareButton />}

            {isDream && (
              <DreamButton
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
