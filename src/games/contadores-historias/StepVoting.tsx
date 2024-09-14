import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Types
import { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { Card } from 'components/cards';
import { ImageCard, ImageCardButton } from 'components/image-cards';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { TableEntry } from './utils/types';
import { mockVote } from './utils/mock';
import { VotingRules } from './components/RulesBlobs';

type StepVotingProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onSubmitVote: GenericFunction;
  storyteller: GamePlayer;
  table: TableEntry[];
  isUserTheStoryTeller: boolean;
} & Pick<StepProps, 'announcement'>;

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
                id={cardEntry.cardId}
                onClick={!hasPlayedCardAlready ? onSelectCard : undefined}
                disabled={isLoading || isUserCard}
                buttonText={
                  isUserCard ? <Translate pt="Sua" en="Yours" /> : <Translate pt="Votar" en="Vote" />
                }
              >
                <ImageCard
                  id={cardEntry.cardId}
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
