import { useMemo, useState } from 'react';
import clsx from 'clsx';
//Design Resources
import { Button, Divider } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components

import { Topic } from './components/Topic';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TransparentButton } from 'components/buttons';
import { ReadyPlayersBar } from 'components/players';
import { IconAvatar } from 'components/icons/IconAvatar';
import { SpeechBubbleThumbsUpIcon } from 'components/icons/SpeechBubbleThumbsUpIcon';
import { SpeechBubbleThumbsDownIcon } from 'components/icons/SpeechBubbleThumbsDownIcon';

type StepLikingProps = {
  currentTopic: Topic;
  customTopic: string;
  onSubmitReaction: GenericFunction;
  players: GamePlayers;
};

export function StepLiking({ currentTopic, customTopic, onSubmitReaction, players }: StepLikingProps) {
  const { isLoading } = useLoading();
  const [like, setLike] = useState<boolean | null>(null);

  const onSubmitReactions = (likes: number) => {
    onSubmitReaction({ reaction: like, likesGuess: likes });
  };

  const countOptions = useMemo(
    () =>
      Array(Object.keys(players).length + 1)
        .fill(0)
        .map((e, i) => e + i),
    [players]
  );

  return (
    <Step fullWidth className="p-step">
      <Title>
        <Translate pt="O que você acha da polêmica da vez?" en="What do you think of this trending topic?" />
      </Title>

      <div className="p-reaction-buttons">
        <Topic topic={customTopic ?? currentTopic?.text} className="p-reaction-buttons__topic" />
        <TransparentButton
          className={clsx(
            'p-reaction-button',
            'p-reaction-button--like',
            like === true && 'p-reaction-button--active'
          )}
          onClick={() => setLike(true)}
        >
          <IconAvatar icon={<SpeechBubbleThumbsUpIcon />} shape="square" className="p-like-icon" />
          <Translate pt="Curtir" en="Like" />
        </TransparentButton>
        <TransparentButton
          className={clsx(
            'p-reaction-button',
            'p-reaction-button--dislike',
            like === false && 'p-reaction-button--active'
          )}
          onClick={() => setLike(false)}
        >
          <IconAvatar icon={<SpeechBubbleThumbsDownIcon />} shape="square" className="p-like-icon" />
          <Translate pt="Não curto" en="Dislike" />
        </TransparentButton>
      </div>

      {like !== null && (
        <>
          <Instruction contained>
            <Translate
              pt="Quantas curtidas esse assunto vai receber?"
              en="How many likes will this topic get?"
            />
          </Instruction>

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
        </>
      )}
      <Divider />

      <ReadyPlayersBar players={players} />
    </Step>
  );
}
