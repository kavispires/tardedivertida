import React, { useMemo, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
//Design Resources
import { Button } from 'antd';
import { DislikeFilled, LikeFilled } from '@ant-design/icons';
// Components
import { Instruction, Title, Translate } from '../../components/shared';
import { Topic } from './Topic';

function LikingStep({ currentTopic, customTopic, onSubmitReaction, players }) {
  const [like, setLike] = useState(null);

  const onSubmitReactions = (likes) => {
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
    <div className="p-step">
      <Title>
        <Topic topic={customTopic ?? currentTopic?.text} />
      </Title>

      <Instruction>
        <Translate pt="O que você acha da polêmica da vez?" en="What do you think of the trending topic?" />
      </Instruction>

      <div className="p-reaction-buttons">
        <Button
          className={clsx('p-reaction-buttons__like', like === true && 'p-reaction-buttons__like--active')}
          size="large"
          type="primary"
          icon={<LikeFilled />}
          onClick={() => setLike(true)}
        >
          <Translate pt="Curtir" en="Like" />
        </Button>
        <Button
          className={clsx(
            'p-reaction-buttons__dislike',
            like === false && 'p-reaction-buttons__dislike--active'
          )}
          size="large"
          type="primary"
          icon={<DislikeFilled />}
          onClick={() => setLike(false)}
        >
          <Translate pt="Não curto" en="Dislike" />
        </Button>
      </div>

      {like !== null && (
        <Fragment>
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
                  >
                    {option}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Fragment>
      )}
    </div>
  );
}

LikingStep.propTypes = {
  currentTopic: PropTypes.shape({
    text: PropTypes.string,
  }),
  customTopic: PropTypes.string,
  onSubmitReaction: PropTypes.func,
  players: PropTypes.object,
};

export default LikingStep;
