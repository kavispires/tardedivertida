import clsx from 'clsx';
// Design Resources
import { Button } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks & Utils
import { useCardWidth, useLanguage, useLoading } from 'hooks';
import { isDevEnv } from 'utils/helpers';
// Components
import { Card, ImageBlurButton, ImageCard, PopoverRule, ReadyPlayersBar, Title, Translate } from 'components';
import { VotingRules } from './RulesBlogs';

type StepVotingProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onSubmitVote: GenericFunction;
  storyteller: GamePlayer;
  table: TableEntry[];
};

export function StepVoting({ players, story, user, onSubmitVote, storyteller, table }: StepVotingProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(Math.max(Object.keys(players).length, 6), 32, 150);

  const hasPlayedCardAlready = Boolean(user.vote);

  const onSelectCard = (vote: string) => {
    onSubmitVote({
      vote,
    });
  };

  return (
    <div className="c-step-play-card">
      <Title>
        <Translate pt="Qual carta é a ilustração correta?" en="What card is the correct one?" />
        <Card header={storyteller.name} className="c-story-card" color="yellow">
          {story}
        </Card>
      </Title>
      <PopoverRule content={<VotingRules />} />

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
                  {isUserCard ? translate('Sua', 'Yours') : translate('Votar', 'Vote')}
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
