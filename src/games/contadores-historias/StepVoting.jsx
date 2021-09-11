import React, { useMemo } from 'react';
import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks & Utils
import { useBlurCards, useDimensions, useLanguage, useLoading } from '../../hooks';
import { isDevEnv } from '../../utils';
// Components
import { ReadyPlayersBar, Title, translate, Translate } from '../../components/shared';
import { Card, ImageCard } from '../../components/cards';

function StepVoting({ players, story, user, onSubmitVote, storyteller, table }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [screenWidth] = useDimensions();
  const [blurredCards, addBlurCard, isFlavia] = useBlurCards();

  const hasPlayedCardAlready = Boolean(user.vote);
  const cardWidth = useMemo(() => Math.max((screenWidth - 100) / (Object.keys(players).length + 3), 150), [
    screenWidth,
    players,
  ]);

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
                  // ghost
                  disabled={isLoading || isUserCard}
                >
                  {isUserCard ? translate('Sua', 'Yours', language) : translate('Votar', 'Vote', language)}
                </Button>
              )}
              <ImageCard
                imageId={cardEntry.cardId}
                cardWidth={cardWidth}
                className={clsx(
                  blurredCards?.[cardEntry.cardId] && 'c-game-table--blur',
                  isUserVote && 'c-game-table--vote'
                )}
              />
              {isDevEnv && <div>{cardEntry.cardId}</div>}

              {isFlavia && (
                <Button ghost onClick={() => addBlurCard(cardEntry.cardId)} size="small">
                  {translate('Credo', 'Blur', language)}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <ReadyPlayersBar players={players} />
    </div>
  );
}

export default StepVoting;
