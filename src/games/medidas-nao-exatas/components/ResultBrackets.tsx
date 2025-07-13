// Ant Design Resources
import { Avatar as AntAvatar, Divider, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Icons
import { BoxXIcon } from 'icons/collection';
import { XIcon } from 'icons/XIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { AvatarTooltip } from 'components/avatars/AvatarTooltip';
import { Card } from 'components/cards';
// Internal
import type { GalleryBracket } from '../utils/types';
import { BracketPointsBox } from './BracketPointsBox';

type ResultBracketsProps = {
  brackets: GalleryBracket[];
  players: GamePlayers;
  cards: Dictionary<TextCard>;
};

export function ResultBrackets({ brackets, players, cards }: ResultBracketsProps) {
  return (
    <div className="m-guessing-board__points-brackets">
      {brackets.map((bracket, index) => (
        <div key={`${bracket.score}-${index}`} className="m-guessing-board__points-bracket">
          <BracketPointsBox width="48px">
            <span className="m-guessing-board__points-bracket-label">{bracket.score}</span>
          </BracketPointsBox>
          <div className="m-guessing-board__points-bracket-value">
            <AntAvatar.Group>
              {bracket.playersIds.map((playerId) => {
                return (
                  <span key={playerId}>
                    <AvatarTooltip player={players[playerId]} />
                  </span>
                );
              })}
              {bracket.playersIds.length === 0 && <IconAvatar icon={<BoxXIcon />} />}
            </AntAvatar.Group>
            <Divider type="vertical" />
            <Flex vertical>
              {bracket.wrongGuesses.map((guess) => {
                return (
                  <Flex key={guess.playerId} align="center">
                    <IconAvatar icon={<XIcon />} size={16} />{' '}
                    <AvatarTooltip player={players[guess.playerId]} />
                    <Card hideHeader size="small">
                      {cards[guess.cardId]?.text || '???'}
                    </Card>
                  </Flex>
                );
              })}
            </Flex>
          </div>
        </div>
      ))}
    </div>
  );
}
