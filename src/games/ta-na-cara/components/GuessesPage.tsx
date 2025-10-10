import { useMemo } from 'react';
// Ant Design Resources
import { Divider, Flex } from 'antd';
// Components
import { Translate } from 'components/language';
import {
  SlideShowBubbleValue,
  SlideShowLabel,
  SlideShowNoWins,
  SlideShowPlayersList,
} from 'components/slide-show';
// Internal
import type { GalleryEntry, PhaseRevealState } from '../utils/types';
import { SuspectCard } from 'components/cards/SuspectCard';
import { AvatarName, IconAvatar } from 'components/avatars';
import type { GamePlayer, GamePlayers } from 'types/player';
import { orderBy } from 'lodash';
import { SpeechBubbleThumbsDownIcon, StarIcon } from 'icons/collection';

type GuessesPageProps = {
  entry: GalleryEntry;
  players: GamePlayers;
  currentPlayer: GamePlayer;
  currentColor: string;
} & Pick<PhaseRevealState, 'identitiesDict'>;

export function GuessesPage({
  entry,
  players,
  identitiesDict,
  currentPlayer,
  currentColor,
}: GuessesPageProps) {
  const correctPlayersIds = useMemo(
    () => orderBy(entry.correctPlayersIds, [(playerId) => players[playerId]?.name || ''], ['asc']),
    [entry.correctPlayersIds, players],
  );

  return (
    <Flex className="full-width" vertical gap={6}>
      <div className="full-width" style={{ backgroundColor: currentColor }}>
        <AvatarName player={currentPlayer} size="large" className="invisible" />
      </div>

      <SlideShowLabel>
        <Translate pt="Palpites Corretos" en="Correct Guesses" />
      </SlideShowLabel>

      {correctPlayersIds.length === 0 && (
        <SlideShowNoWins>
          <Translate pt="Ninguém acertou!" en="No one guessed it!" />
        </SlideShowNoWins>
      )}
      {correctPlayersIds.length > 0 && (
        <>
          <Flex>
            <IconAvatar icon={<StarIcon />} />
            <IconAvatar icon={<StarIcon />} />
            <IconAvatar icon={<StarIcon />} />
            <IconAvatar icon={<StarIcon />} />
            <IconAvatar icon={<StarIcon />} />
          </Flex>

          <Flex vertical gap={6}>
            {correctPlayersIds.map((playerId) => (
              <SlideShowPlayersList key={playerId} playersIds={[playerId]} players={players} />
            ))}
          </Flex>
        </>
      )}

      {entry.wrongVotes.length > 0 && (
        <>
          <Divider className="my-4" />
          <SlideShowLabel>
            <Translate pt="Escolhas erradas" en="Wrong Choices" />
          </SlideShowLabel>

          <Flex className="idp-gallery__guess" wrap="wrap" gap={12}>
            {entry.wrongVotes.map((wrongEntry) => {
              return (
                <div key={wrongEntry.identityId}>
                  <SlideShowBubbleValue
                    extra={
                      <Flex align="center" gap={3} style={{ height: '100%', marginLeft: 12 }}>
                        <IconAvatar icon={<SpeechBubbleThumbsDownIcon />} />
                      </Flex>
                    }
                  >
                    <SuspectCard suspect={identitiesDict[wrongEntry.identityId]} width={64} />
                  </SlideShowBubbleValue>

                  <SlideShowPlayersList playersIds={wrongEntry.playerIds} players={players} />
                </div>
              );
            })}
          </Flex>
        </>
      )}
    </Flex>
  );
}
