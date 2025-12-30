import clsx from 'clsx';
import { useMemo, type ReactNode } from 'react';
import { useToggle } from 'react-use';
// Ant Design Resources
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Image, Tooltip } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { AlienHeartEyesIcon } from 'icons/AlienHeartEyesIcon';
import { AlienNeutralIcon } from 'icons/AlienNeutralIcon';
import { AlienStarEyesIcon } from 'icons/AlienStarEyesIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { DivButton } from 'components/buttons/DivButton';
import { Popconfirm } from 'components/general/Popconfirm';
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
    const otherPlayerSide = getOtherSide(userSide);
    return deck.some(
      (entry) =>
        entry.affiliation[userIndex] === AFFILIATIONS.TABOO &&
        entry.affiliation[otherPlayerIndex] === otherPlayerSide &&
        entry.deliveredBy?.length,
    );
  }, [deck, userSide, userIndex]);

  return (
    <Image.PreviewGroup>
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
              <Popconfirm
                key={entry.id}
                title={
                  <Translate
                    en="Are you sure you want to deliver this item?"
                    pt="Você tem certeza que deseja entregar este item?"
                  />
                }
                trigger={deckType === 'images' ? 'hover' : 'click'}
                onConfirm={() => onClick(entry)}
              >
                <TransparentButton
                  key={entry.id}
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
              </Popconfirm>
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
    </Image.PreviewGroup>
  );
}

type CoverAlienCardProps = {
  side: string;
  children: ReactNode;
};
function CoverAlienCard({ side, children }: CoverAlienCardProps) {
  const [open, setOpen] = useToggle(false);

  return (
    <DivButton className="cd-board-entry-cover" onClick={setOpen}>
      <div
        className={clsx(
          'cd-board-entry-cover__alien',
          `cd-board-entry-cover__alien--${getOtherSide(side)}`,
          open && 'cd-board-entry-cover__alien--open',
        )}
      >
        {side === 'A' ? (
          <AlienHeartEyesIcon style={{ width: 36 }} />
        ) : (
          <AlienStarEyesIcon style={{ width: 36 }} />
        )}
      </div>
      {children}
    </DivButton>
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

  const haveIDelivered = entry.deliveredBy?.includes(userId);
  const hasTheOtherPlayerDelivered = !!entry.deliveredBy?.filter((id) => id !== userId).length;

  return (
    <div
      className={clsx(
        'cd-board-entry-neutral',
        entry.deliveredBy?.includes(userId) && 'cd-board-entry-neutral--not-allowed',
      )}
    >
      {haveIDelivered && (
        <span className={clsx(animateEntries.includes(entry.id) && getAnimationClass('tada'))}>
          <IconAvatar
            className={clsx('cd-board-entry-neutral-item', `cd-board-entry-neutral-item--${userSide}`)}
            icon={<AlienNeutralIcon color={userSide === 'A' ? 'teal' : 'orange'} />}
          />
        </span>
      )}
      {hasTheOtherPlayerDelivered && (
        <span className={clsx(animateEntries.includes(entry.id) && getAnimationClass('tada'))}>
          <IconAvatar
            className={clsx(
              'cd-board-entry-neutral-item',
              `cd-board-entry-neutral-item--${getOtherSide(userSide)}`,
            )}
            icon={<AlienNeutralIcon color={userSide === 'A' ? 'orange' : 'teal'} />}
          />
        </span>
      )}
      {children}
    </div>
  );
}

const getOtherSide = (side: string) => (side === 'A' ? 'B' : 'A');
