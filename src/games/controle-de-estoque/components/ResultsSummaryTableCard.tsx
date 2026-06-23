import clsx from 'clsx';
import { Fragment } from 'react';
// Ant Design Resources
import { Card, Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Icons
import { CheckMarkIcon } from '@icons/CheckMarkIcon';
import { StarIcon } from '@icons/StarIcon';
import { XIcon } from '@icons/XIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { WarehouseGoodCard } from '@components/cards/WarehouseGoodCard';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import type { GalleryEntry, Good } from '../utils/types';

const GOOD_WIDTH = 64;

type ResultsSummaryTableCardProps = {
  playersList: GamePlayer[];
  correctEntries: Dictionary<GalleryEntry[]>;
  wrongEntries: Dictionary<GalleryEntry[]>;
  goodsDict: Dictionary<Good>;
  correctPointValue: number;
  wrongPointValue: number;
};

export function ResultsSummaryTableCard({
  playersList,
  correctEntries,
  wrongEntries,
  goodsDict,
  correctPointValue,
  wrongPointValue,
}: ResultsSummaryTableCardProps) {
  return (
    <Card classNames={{ body: 'c-results-summary-table' }}>
      <div />
      <Flex
        className="c-results-summary-table__header-cell"
        align="center"
        justify="center"
        gap={2}
      >
        <Translate
          pt="Corretos"
          en="Fulfilled"
        />
        <IconAvatar icon={<CheckMarkIcon />} />
      </Flex>
      <div>
        <span className="c-results-summary-table__score-highlight">
          {correctPointValue}
          <IconAvatar
            icon={<StarIcon />}
            size="small"
          />
        </span>
      </div>
      <Flex
        className="c-results-summary-table__header-cell"
        align="center"
        justify="center"
        gap={2}
      >
        <Translate
          pt="Errados"
          en="Wrong"
        />
        <IconAvatar icon={<XIcon />} />
      </Flex>

      <div>
        <span className="c-results-summary-table__score-highlight-loss">
          {wrongPointValue}
          <IconAvatar
            icon={<StarIcon />}
            size="small"
          />
        </span>
      </div>

      {playersList.map((player) => {
        const fulfilled = correctEntries[player.id] || [];
        const wrong = wrongEntries[player.id] || [];

        return (
          <Fragment key={player.id}>
            <div className="c-results-summary-table__player">
              <PlayerAvatarName player={player} />
            </div>
            {fulfilled.length > 0 ? (
              <div className="c-results-summary-table__goods c-results-summary-table__goods--correct">
                {fulfilled.map((entry) => (
                  <span key={entry.orderId}>
                    <WarehouseGoodCard
                      goodId={entry.orderId}
                      width={GOOD_WIDTH}
                      className={clsx(`warehouse__good--${goodsDict[entry.orderId]?.orientation ?? 0}`)}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <div className="c-results-summary-table__no-goods c-results-summary-table__goods--correct">
                <Translate
                  pt="Nenhum"
                  en="None"
                />
              </div>
            )}

            <div className="c-results-summary-table__score-cell c-results-summary-table__goods--correct">
              {fulfilled.length > 0 ? (
                <div className="c-results-summary-table__score-value">
                  <span>{fulfilled.length} ×</span>
                </div>
              ) : (
                <div className="c-results-summary-table__score-value">0</div>
              )}
            </div>

            {wrong.length > 0 ? (
              <div className="c-results-summary-table__goods c-results-summary-table__goods--wrong">
                {wrong.map((entry) => (
                  <span key={entry.orderId}>
                    {' '}
                    <WarehouseGoodCard
                      goodId={entry.orderId}
                      width={GOOD_WIDTH}
                      className={clsx(`warehouse__good--${goodsDict[entry.orderId]?.orientation ?? 0}`)}
                    />
                  </span>
                ))}
              </div>
            ) : (
              <div className="c-results-summary-table__no-goods c-results-summary-table__goods--wrong">
                <Translate
                  pt="Nenhum"
                  en="None"
                />
              </div>
            )}

            <div className="c-results-summary-table__score-cell c-results-summary-table__goods--wrong">
              {wrong.length > 0 ? (
                <div className="c-results-summary-table__score-value">
                  <span>{fulfilled.length} ×</span>
                </div>
              ) : (
                <div className="c-results-summary-table__score-value">0</div>
              )}
            </div>
          </Fragment>
        );
      })}
    </Card>
  );
}
