import { useMemo, useState } from 'react';
import clsx from 'clsx';
//Design Resources
import { Button, Divider } from 'antd';
// Components
import { AvatarIcon, Instruction, ReadyPlayersBar, Step, Title, Translate } from '../../components';
import { Topic } from './Topic';

type StepLikingProps = {
  currentTopic: Topic;
  customTopic: string;
  onSubmitReaction: GenericFunction;
  players: GamePlayers;
};

export function StepLiking({ currentTopic, customTopic, onSubmitReaction, players }: StepLikingProps) {
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
        <Button
          className={clsx('p-reaction-buttons__like', like === true && 'p-reaction-buttons__like--active')}
          size="large"
          type="primary"
          onClick={() => setLike(true)}
        >
          <AvatarIcon type="speech-bubble-thumbs-up" shape="square" className="p-like-icon" />
          <Translate pt="Curtir" en="Like" />
        </Button>
        <Button
          className={clsx(
            'p-reaction-buttons__dislike',
            like === false && 'p-reaction-buttons__dislike--active'
          )}
          size="large"
          type="primary"
          onClick={() => setLike(false)}
        >
          <AvatarIcon type="speech-bubble-thumbs-down" shape="square" className="p-like-icon" />
          <Translate pt="Não curto" en="Dislike" />
        </Button>
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
                    disabled={like === null}
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