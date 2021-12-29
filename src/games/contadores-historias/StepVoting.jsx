import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks & Utils
import { useCardWidth, useLanguage, useLoading } from '../../hooks';
import { isDevEnv } from '../../utils/helpers';
// Components
import { ReadyPlayersBar, Title, translate, Translate } from '../../components/shared';
import { Card, ImageBlurButton, ImageCard } from '../../components/cards';

function StepVoting({ players, story, user, onSubmitVote, storyteller, table }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const cardWidth = useCardWidth(Math.max(Object.keys(players).length, 6), 32, 150);

  const hasPlayedCardAlready = Boolean(user.vote);

  const onSelectCard = (vote) => {
    onSubmitVote({
      action: 'SUBMIT_VOTE',
      vote,
    });
  };

  return (
    <div className="c-step-play-card">
      <Title center>
        <Translate pt="Qual carta é a ilustração correta?" en="What card is the correct one?" />
        <Card header={storyteller.name} className="c-story-card" color="yellow">
          {story}
        </Card>
      </Title>

      <div className="c-game-table">
        {table.map((cardEntry) => {
          const isUserCard = cardEntry.playerId === user.id;
          const isUserVote = cardEntry.cardId === user.vote;
          return (
            <div key={`hand-${cardEntry.cardId}`} className="c-game-table__card-container">
              {!hasPlayedCardAlready && (
                <Button
                  icon={<DownSquareOutlined />}
                  onClick={() => onSelectCard(cardEntry.cardId)}
                  size="small"
                  disabled={isLoading || isUserCard}
                >
                  {isUserCard ? translate('Sua', 'Yours', language) : translate('Votar', 'Vote', language)}
                </Button>
              )}
              <ImageCard
                imageId={cardEntry.cardId}
                cardWidth={cardWidth}
                className={clsx(isUserVote && 'c-game-table--vote')}
              />
              {isDevEnv && <div>{cardEntry.cardId}</div>}

              <ImageBlurButton cardId={cardEntry.cardId} />
            </div>
          );
        })}
      </div>

      <ReadyPlayersBar players={players} />
    </div>
  );
}

export default StepVoting;
