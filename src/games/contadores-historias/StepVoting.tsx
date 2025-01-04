import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { isEverybodyReady } from 'utils/helpers';
// Components
import { Card } from 'components/cards';
import { ImageCard, ImageCardButton } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { TimedTimerBar } from 'components/timers';
// Internal
import type { SubmitVotePayload, TableEntry } from './utils/types';
import { mockVote } from './utils/mock';
import { VotingRules } from './components/RulesBlobs';

type StepVotingProps = {
  players: GamePlayers;
  story: string;
  user: GamePlayer;
  onSubmitVote: (payload: SubmitVotePayload) => void;
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

  const everybodyReady = isEverybodyReady(players);

  const onSelectCard = (vote: string) => {
    onSubmitVote({
      vote,
    });
  };

  useMock(() => {
    if (!isUserTheStoryTeller) {
      onSubmitVote(mockVote(table, user.cardId));
    }
  }, [user?.hand]);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Qual carta é a ilustração correta?" en="What card is the correct one?" />
      </StepTitle>

      <SpaceContainer>
        <Card header={storyteller.name} className="c-story-card" color="yellow">
          {story}
        </Card>
      </SpaceContainer>

      <PopoverRule content={<VotingRules isUserTheStoryTeller={isUserTheStoryTeller} />} />

      <RuleInstruction type={isUserTheStoryTeller ? 'wait' : 'action'}>
        <VotingRules isUserTheStoryTeller={isUserTheStoryTeller} />
      </RuleInstruction>

      {everybodyReady && <TimedTimerBar duration={15} onExpire={() => {}} />}

      <Space className="c-game-table" wrap>
        {table.map((cardEntry) => {
          const isUserCard = cardEntry.playerId === user.id;
          const isUserVote = cardEntry.cardId === user.vote;
          return (
            <div key={`hand-${cardEntry.cardId}`} className="c-game-table__card-container">
              <ImageCardButton
                id={cardEntry.cardId}
                onClick={!isUserTheStoryTeller ? onSelectCard : undefined}
                disabled={isLoading || isUserCard}
                buttonText={
                  isUserCard ? <Translate pt="Sua" en="Yours" /> : <Translate pt="Votar" en="Vote" />
                }
              >
                <ImageCard
                  id={cardEntry.cardId}
                  cardWidth={cardWidth}
                  className={clsx(isUserVote ? 'c-game-table--vote' : 'c-game-table--idle')}
                />
              </ImageCardButton>
            </div>
          );
        })}
      </Space>
    </Step>
  );
}
