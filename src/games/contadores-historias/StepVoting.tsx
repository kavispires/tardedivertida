import clsx from 'clsx';
// Ant Design Resources
import { Button } from 'antd';
import { DownSquareOutlined } from '@ant-design/icons';
// Hooks & Utils
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { mockVote } from './utils/mock';
// Components
import { Card, ImageBlurButton, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { VotingRules } from './components/RulesBlobs';
import { DebugOnly } from 'components/debug';
import { ReadyPlayersBar } from 'components/players';

type StepVotingProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onSubmitVote: GenericFunction;
  storyteller: GamePlayer;
  table: TableEntry[];
  isUserTheStoryTeller: boolean;
};

export function StepVoting({
  players,
  story,
  user,
  onSubmitVote,
  storyteller,
  table,
  isUserTheStoryTeller,
}: StepVotingProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(Math.max(Object.keys(players).length, 6), 32, 150);

  const hasPlayedCardAlready = Boolean(user.vote);

  const onSelectCard = (vote: string) => {
    onSubmitVote({
      vote,
    });
  };

  useMock(() => {
    if (!isUserTheStoryTeller) {
      onSubmitVote(mockVote(table, user.hand));
    }
  }, []);

  return (
    <Step fullWidth className="c-step-play-card">
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
              <DebugOnly div>{cardEntry.cardId}</DebugOnly>

              <ImageBlurButton cardId={cardEntry.cardId} />
            </div>
          );
        })}
      </div>

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
