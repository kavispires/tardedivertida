import { orderBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Icons
import { StarIcon } from 'icons/StarIcon';
// Components
import { PlayerAvatarEntry, IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import {
  SlideShowBubbleValue,
  SlideShowLabel,
  SlideShowNoWins,
  SlideShowPlayersList,
} from 'components/slide-show';
// Internal
import type { GalleryEntry } from '../utils/types';
import { useSpriteWidth } from '../utils/useSpriteWidth';

type CreditsPageProps = {
  creator: GamePlayer;
  creatorColor: string;
  entry: GalleryEntry;
  players: GamePlayers;
};

export function CreditsPage({
  creator,
  creatorColor,
  entry,

  players,
}: CreditsPageProps) {
  const itemWidth = useSpriteWidth();

  const votes = useMemo(() => {
    return orderBy(
      Object.keys(entry.guesses).reduce(
        (acc, votedItemId) => {
          const playersIdsWhoGuessed = entry.guesses[votedItemId];

          acc.push({
            itemId: votedItemId,
            playersIds: playersIdsWhoGuessed,
            correct: votedItemId === entry.itemId,
          });
          return acc;
        },
        [] as { itemId: string; playersIds: string[]; correct: boolean }[],
      ),
      [(o) => o.itemId === entry.itemId, 'playersIds.length'],
      ['desc', 'desc'],
    );
  }, [entry.guesses, entry.itemId]);

  return (
    <>
      <div className="idp-gallery__credits">
        <SlideShowLabel>
          <Translate pt="Criador" en="Creator" />
        </SlideShowLabel>
        <span className="uppercase">
          <PlayerAvatarEntry player={creator} />
        </span>
      </div>

      <div className="idp-gallery__guesses">
        <SlideShowLabel>
          <Translate pt="Participantes votaram" en="Players voted" />
        </SlideShowLabel>

        <div className="idp-gallery__guess">
          {votes.map((vote) => {
            return (
              <div key={vote.itemId}>
                <SlideShowBubbleValue
                  winner={vote.correct}
                  backgroundColor={creatorColor}
                  extra={
                    <Flex align="center" gap={3} style={{ height: '100%' }}>
                      <IconAvatar icon={<StarIcon />} size="small" /> 2
                    </Flex>
                  }
                >
                  <ItemCard itemId={vote.itemId} width={itemWidth / 2} />
                </SlideShowBubbleValue>

                <SlideShowPlayersList playersIds={vote.playersIds} players={players} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="sda-gallery__result">
        {votes.length === 0 && (
          <SlideShowNoWins>
            <Translate
              pt="Esse nome deve ter sido muito ruim."
              en="It must have been a very crappy name. Shame..."
            />
          </SlideShowNoWins>
        )}
      </div>
    </>
  );
}
