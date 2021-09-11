import React from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLoading } from '../../hooks';
// Components
import { Card, ImageCardHand as Hand } from '../../components/cards';
import { Instruction, ReadyPlayersBar, Title, Translate, ViewIf } from '../../components/shared';
import TableFaceDown from './TableFaceDown';

function StepPlayCard({ players, story, user, onPlayCard, storyteller, isUserTheStoryTeller }) {
  const [isLoading] = useLoading();
  const hasPlayedCardAlready = Boolean(user.cardId);

  const onSelectCard = (cardId) => {
    onPlayCard({
      action: 'PLAY_CARD',
      cardId,
    });
  };

  return (
    <div className="c-step-play-card">
      <Title center>
        <Card header={storyteller.name} className="c-story-card" randomColor>
          {story}
        </Card>
      </Title>
      <ViewIf isVisible={isUserTheStoryTeller}>
        <Instruction>
          <Translate
            pt="Agora, cada jogador escolherá uma carta em mão que mais combine com a história que você escreveu"
            en="Now every other player will play a card that best matches the story you wrote"
          />
        </Instruction>
      </ViewIf>
      <ViewIf isVisible={!isUserTheStoryTeller}>
        <Instruction contained>
          <Translate
            pt="Agora, escolha uma carta que mais combine com a história da rodada. Você está tentando convencer os outros jogadores a escolherem sua carta ao invés da carta correta"
            en="Now you select a card that matches the story the best. You are trying to convince other players that your card is the correct one"
          />
        </Instruction>
      </ViewIf>
      <TableFaceDown players={players} user={user} />
      <ReadyPlayersBar players={players} />
      <Hand
        hand={user.hand}
        onSelectCard={hasPlayedCardAlready ? null : onSelectCard}
        disabledSelectButton={isLoading || hasPlayedCardAlready}
      />
    </div>
  );
}

StepPlayCard.propTypes = {
  isUserTheStoryTeller: PropTypes.object,
  onPlayCard: PropTypes.func,
  players: PropTypes.object,
  story: PropTypes.string,
  storyteller: PropTypes.shape({
    name: PropTypes.string,
  }),
  user: PropTypes.shape({
    cardId: PropTypes.string,
    hand: PropTypes.array,
  }),
};

export default StepPlayCard;
