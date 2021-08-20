import React from 'react';
import PropTypes from 'prop-types';
// Components
import { ButtonContainer, Instruction, Translate } from '../../components/shared';
import { Button } from 'antd';
import { useLoading } from '../../hooks';
import { LockFilled, PlusCircleFilled } from '@ant-design/icons';

function UserAnswers({ answerGroup, user, onAddAnswer }) {
  const [isLoading] = useLoading();

  const alreadyHasAnswer = answerGroup.entries.some((entry) => entry.playerId === user.id);

  return (
    <div className="m-step">
      <div className="m-step__contained-content">
        <Instruction contained>
          <Translate
            pt="Se você cometeu um erro ortográfico ou acha que sua resposta deveria estar no grupo acima, clique nela para adicioná-la. Você só pode ter uma resposta por pergunta!"
            en="If you made a typo or for some reason think your answer should be in this group, click on it to add it. You can only have one answer per question."
          />
        </Instruction>

        <ButtonContainer className="m-user-answers">
          {Object.entries(user.answers).map(([key, answerObj]) => {
            return (
              <Button
                key={`a-b-${key}`}
                disabled={answerObj?.isLocked || alreadyHasAnswer || isLoading}
                className="m-user-answer"
                icon={answerObj.isLocked ? <LockFilled /> : <PlusCircleFilled />}
                onClick={() => onAddAnswer({ id: key, playerId: user.id, ...answerObj })}
              >
                {answerObj.answer}
              </Button>
            );
          })}
        </ButtonContainer>
      </div>
    </div>
  );
}

UserAnswers.propTypes = {
  currentQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      prefix: PropTypes.string,
      number: PropTypes.number,
      suffix: PropTypes.string,
    })
  ),
  onQuestionSelection: PropTypes.func,
  players: PropTypes.object,
};

export default UserAnswers;
