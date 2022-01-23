// Design Resources
import { Avatar } from 'antd';
// Components
import {
  AvatarName,
  FloatingHand,
  ImageCardHand as Hand,
  Icons,
  Instruction,
  Title,
  Translate,
  TurnOrder,
} from '../../components';

type StoryWaitingProps = {
  storyteller: GamePlayer;
  user: GamePlayer;
  players: GamePlayers;
  gameOrder: PlayerId[];
};

export function StoryWaiting({ storyteller, user, players, gameOrder }: StoryWaitingProps) {
  return (
    <div className="c-story-waiting">
      <Title>
        <Avatar src={<Icons.AnimatedClock />} size="large" />{' '}
        <Translate pt="Aguarde..." en="Please wait..." />
      </Title>
      <Instruction contained>
        <AvatarName player={storyteller} addressUser />{' '}
        <Translate
          pt="está escrevendo uma história para essa rodada."
          en="is writing a story for this round."
        />
        <br />
        <Translate
          pt="Enquanto isso, examine suas cartas! Você as usará durante esta rodada."
          en="In the meantime, examine your cards. You're gonna use them this round."
        />
      </Instruction>
      <TurnOrder players={players} activePlayerId={storyteller.id} order={gameOrder} />
      <FloatingHand>
        <Hand hand={user.hand} sizeRatio={user.hand.length} />
      </FloatingHand>
    </div>
  );
}
