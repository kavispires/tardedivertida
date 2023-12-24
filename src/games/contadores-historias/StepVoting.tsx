import clsx from 'clsx';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockVote } from './utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { VotingRules } from './components/RulesBlobs';
import { ImageCard, ImageCardButton } from 'components/image-cards';
import { Space } from 'antd';

type StepVotingProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onSubmitVote: GenericFunction;
  storyteller: GamePlayer;
  table: TableEntry[];
  isUserTheStoryTeller: boolean;
} & AnnouncementProps;

export function StepVoting({
  players,
  story,
  user,
  onSubmitVote,
  storyteller,
  table,
  isUserTheStoryTeller,
  announcement,
}: StepVotingProps) {
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(Math.max(Object.keys(players).length, 8), { minWidth: 150 });

  const hasPlayedCardAlready = Boolean(user.vote);

  const onSelectCard = (vote: string) => {
    onSubmitVote({
      vote,
    });
  };

  useMock(() => {
    if (!isUserTheStoryTeller) {
      onSubmitVote(mockVote(table, user?.hand));
    }
  }, [user?.hand]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate pt="Qual carta é a ilustração correta?" en="What card is the correct one?" />
        <Card header={storyteller.name} className="c-story-card" color="yellow">
          {story}
        </Card>
      </Title>
      <PopoverRule content={<VotingRules />} />

      <RuleInstruction type="action">
        <VotingRules />
      </RuleInstruction>

      <Space className="c-game-table" wrap>
        {table.map((cardEntry) => {
          const isUserCard = cardEntry.playerId === user.id;
          const isUserVote = cardEntry.cardId === user.vote;
          return (
            <div key={`hand-${cardEntry.cardId}`} className="c-game-table__card-container">
              <ImageCardButton
                imageId={cardEntry.cardId}
                onClick={!hasPlayedCardAlready ? onSelectCard : undefined}
                disabled={isLoading || isUserCard}
                buttonText={
                  isUserCard ? <Translate pt="Sua" en="Yours" /> : <Translate pt="Votar" en="Vote" />
                }
              >
                <ImageCard
                  imageId={cardEntry.cardId}
                  cardWidth={cardWidth}
                  className={clsx(isUserVote && 'c-game-table--vote')}
                />
              </ImageCardButton>
            </div>
          );
        })}
      </Space>
    </Step>
  );
}
