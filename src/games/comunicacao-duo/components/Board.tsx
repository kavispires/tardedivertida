import clsx from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useToggle } from 'react-use';
// Ant Design Resources
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { AlienHeartEyesIcon } from 'icons/AlienHeartEyesIcon';
import { AlienNeutralIcon } from 'icons/AlienNeutralIcon';
import { AlienStarEyesIcon } from 'icons/AlienStarEyesIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
// Internal
import type { DeckEntry } from '../utils/types';
import { AFFILIATIONS, DECK_ENTRY_STATUS, SIDES } from '../utils/constants';
import { BoardEntry } from './BoardEntry';

type BoardProps = {
  deck: DeckEntry[];
  deckType: string;
  userSide: string;
  userId: string;
  onClick?: (entry: DeckEntry) => void;
  animateEntries?: string[];
  disabled?: boolean;
};

export function Board({
  deck,
  deckType,
  userId,
  userSide,
  onClick,
  animateEntries = [],
  disabled,
}: BoardProps) {
  const userIndex = SIDES.indexOf(userSide);

  const hasTheOtherPlayersTabooBeenSelected = useMemo(() => {
    // If any of your three taboo has been selected and it's the other player's affiliation.
    const otherPlayerIndex = userIndex === 0 ? 1 : 0;
    const otherPlayerSide = userSide === 'A' ? 'B' : 'A';
    return deck.some(
      (entry) =>
        entry.affiliation[userIndex] === AFFILIATIONS.TABOO &&
        entry.affiliation[otherPlayerIndex] === otherPlayerSide &&
        entry.deliveredBy?.length,
    );
  }, [deck, userSide, userIndex]);

  return (
    <div className="cd-board">
      {deck.map((entry) => {
        const disabledTaboo =
          entry.affiliation[userIndex] === AFFILIATIONS.TABOO && hasTheOtherPlayersTabooBeenSelected;

        if (
          onClick &&
          entry.status === DECK_ENTRY_STATUS.IDLE &&
          !entry.deliveredBy?.includes(userId) &&
          !disabledTaboo
        ) {
          return (
            <TransparentButton
              key={entry.id}
              onClick={() => onClick(entry)}
              disabled={disabled}
              className="cd-board-entry-entry-wrapper"
            >
              <NeutralDeliveriesWrapper
                entry={entry}
                userId={userId}
                userSide={userSide}
                animateEntries={animateEntries}
              >
                <BoardEntry entry={entry} deckType={deckType} userSide={userSide} />
              </NeutralDeliveriesWrapper>
            </TransparentButton>
          );
        }

        if (entry.status === DECK_ENTRY_STATUS.A || entry.status === DECK_ENTRY_STATUS.B) {
          return (
            <span
              key={entry.id}
              className={clsx(animateEntries.includes(entry.id) && getAnimationClass('slideInDown'))}
            >
              <CoverAlienCard side={entry.status}>
                <BoardEntry entry={entry} deckType={deckType} userSide={userSide} />
              </CoverAlienCard>
            </span>
          );
        }

        if ((entry?.deliveredBy?.length ?? 0) > 0) {
          return (
            <div key={entry.id} className="cd-board-entry-entry-wrapper">
              <NeutralDeliveriesWrapper
                entry={entry}
                userId={userId}
                userSide={userSide}
                animateEntries={animateEntries}
              >
                <BoardEntry entry={entry} deckType={deckType} userSide={userSide} />
              </NeutralDeliveriesWrapper>
            </div>
          );
        }

        return (
          <div
            key={entry.id}
            className={clsx(
              'cd-board-entry-entry-wrapper',
              disabledTaboo && onClick && 'cd-board-entry-entry-wrapper--not-allowed',
            )}
          >
            {disabledTaboo && (
              <div className="cd-board-entry-taboo">
                <Tooltip
                  title={
                    <Translate
                      en="You already found the other player's item that matches one of your taboos so none of these other ones can be an item for the other player anymore."
                      pt="Você já encontrou o item do outro jogador que corresponde a um dos seus tabus, então nenhum desses outros tabus seus pode ser um item para o outro jogador."
                    />
                  }
                >
                  <Button shape="circle" size="small" icon={<CloseCircleOutlined />} />
                </Tooltip>
              </div>
            )}
            <BoardEntry entry={entry} deckType={deckType} userSide={userSide} />
          </div>
        );
      })}
    </div>
  );
}

type CoverAlienCardProps = {
  side: string;
  children: ReactNode;
};
function CoverAlienCard({ side, children }: CoverAlienCardProps) {
  const [open, setOpen] = useToggle(false);

  return (
    <div className="cd-board-entry-cover" onClick={setOpen}>
      <div
        className={clsx(
          'cd-board-entry-cover__alien',
          `cd-board-entry-cover__alien--${side}`,
          open && 'cd-board-entry-cover__alien--open',
        )}
      >
        {side === 'A' ? (
          <AlienStarEyesIcon style={{ width: 36 }} />
        ) : (
          <AlienHeartEyesIcon style={{ width: 36 }} />
        )}
      </div>
      {children}
    </div>
  );
}

type NeutralDeliveriesWrapperProps = {
  children: ReactNode;
  entry: DeckEntry;
  userId: string;
  userSide: string;
  animateEntries: string[];
};

function NeutralDeliveriesWrapper({
  children,
  entry,
  userId,
  userSide,
  animateEntries,
}: NeutralDeliveriesWrapperProps) {
  if ((entry?.deliveredBy?.length ?? 0) === 0) {
    return <>{children}</>;
  }

  return (
    <div
      className={clsx(
        'cd-board-entry-neutral',
        entry.deliveredBy?.includes(userId) && 'cd-board-entry-neutral--not-allowed',
      )}
    >
      {entry.deliveredBy?.includes(userId) && (
        <span className={clsx(animateEntries.includes(entry.id) && getAnimationClass('tada'))}>
          <IconAvatar
            className={clsx('cd-board-entry-neutral-item', `cd-board-entry-neutral-item--${userSide}`)}
            icon={<AlienNeutralIcon color={userSide === 'A' ? 'teal' : 'orange'} />}
          />
        </span>
      )}
      {!entry.deliveredBy?.includes(userId) && (
        <span className={clsx(animateEntries.includes(entry.id) && getAnimationClass('tada'))}>
          <IconAvatar
            className={clsx(
              'cd-board-entry-neutral-item',
              `cd-board-entry-neutral-item--${userSide === 'A' ? 'B' : 'A'}`,
            )}
            icon={<AlienNeutralIcon color={userSide === 'A' ? 'orange' : 'teal'} />}
          />
        </span>
      )}
      {children}
    </div>
  );
}
