import { Flex } from 'antd';
import { AvatarCard, IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { SpeechBubble } from 'components/text/SpeechBubble';
import { ArrowIcon } from 'icons/ArrowIcon';
import { Item } from 'types/tdr';
import { Guess } from '../utils/types';
import { GamePlayer } from 'types/player';
import { SelectedAreasCircles } from './SelectedAreasCircles';

type PlayerGuessProps = {
  item: Item;
  currentGuess: Guess;
  activePlayer: GamePlayer;
};

export function PlayerGuess({ item, currentGuess, activePlayer }: PlayerGuessProps) {
  return (
    <Flex justify="center">
      <AvatarCard player={activePlayer} withName addressUser withRoundCorners />
      <SpeechBubble shadow size="medium">
        <Flex gap={6} justify="center" align="center" style={{ height: '100%' }} className="contained">
          <ItemCard id={item.id} text={item.name} width={100} className="q-player-guess-bubble" />{' '}
          <IconAvatar icon={<ArrowIcon />} size="small" />
          <SelectedAreasCircles selectedArea={currentGuess.suggestedArea} size={50} />
        </Flex>
      </SpeechBubble>
    </Flex>
  );
}
