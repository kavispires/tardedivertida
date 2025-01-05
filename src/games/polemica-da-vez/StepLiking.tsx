import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Button } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { SpeechBubbleThumbsDownIcon } from 'icons/SpeechBubbleThumbsDownIcon';
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { TransparentButton } from 'components/buttons';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitReactionPayload } from './utils/types';
import { Tweet } from './components/Tweet';

type StepLikingProps = {
  currentTweet: TextCard;
  customTweet: string;
  onSubmitReaction: (payload: SubmitReactionPayload) => void;
  players: GamePlayers;
} & Pick<StepProps, 'announcement'>;

export function StepLiking({
  currentTweet,
  customTweet,
  onSubmitReaction,
  players,
  announcement,
}: StepLikingProps) {
  const { isLoading } = useLoading();
  const [like, setLike] = useState<boolean | null>(null);

  const onSubmitReactions = (likes: number) => {
    onSubmitReaction({ reaction: !!like, likesGuess: likes });
  };

  const countOptions = useMemo(
    () =>
      Array(Object.keys(players).length + 1)
        .fill(0)
        .map((e, i) => e + i),
    [players],
  );

  return (
    <Step fullWidth className="p-step" announcement={announcement}>
      <StepTitle>
        <Translate pt="O que você acha da polêmica da vez?" en="What do you think of this trending topic?" />
      </StepTitle>

      <div className="p-reaction-buttons">
        <Tweet tweet={customTweet ?? currentTweet?.text} className="p-reaction-buttons__tweet" />
        <TransparentButton
          className={clsx(
            'p-reaction-button',
            'p-reaction-button--like',
            like === true && 'p-reaction-button--active',
          )}
          onClick={() => setLike(true)}
        >
          <IconAvatar icon={<SpeechBubbleThumbsUpIcon />} shape="square" className="p-like-icon" />
          <Translate pt="Curto" en="Like" />
        </TransparentButton>
        <TransparentButton
          className={clsx(
            'p-reaction-button',
            'p-reaction-button--dislike',
            like === false && 'p-reaction-button--active',
          )}
          onClick={() => setLike(false)}
        >
          <IconAvatar icon={<SpeechBubbleThumbsDownIcon />} shape="square" className="p-like-icon" />
          <Translate pt="Não curto" en="Dislike" />
        </TransparentButton>
      </div>

      {like !== null && (
        <div className={getAnimationClass('fadeIn')}>
          <RuleInstruction type="action">
            <Translate
              pt="Quantas curtidas esse assunto vai receber?"
              en="How many likes will this tweet get?"
            />
          </RuleInstruction>

          <ul className="p-votes">
            {countOptions.map((option) => {
              const key = `quantity-${option}`;
              return (
                <li key={key}>
                  <Button
                    type="primary"
                    disabled={isLoading || like === null}
                    onClick={() => onSubmitReactions(option)}
                    size="large"
                    shape="circle"
                  >
                    {option}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Step>
  );
}
