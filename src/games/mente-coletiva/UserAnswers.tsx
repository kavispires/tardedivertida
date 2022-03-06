// Ant Design Resources
import { Button } from 'antd';
import { LockFilled, PlusCircleFilled } from '@ant-design/icons';
// Hooks
import { useLoading } from 'hooks';
// Components
import { ButtonContainer, Instruction, Translate } from 'components';

type UserAnswersProps = {
  answerGroup: any;
  user: GamePlayer;
  onAddAnswer: GenericFunction;
};

export function UserAnswers({ answerGroup, user, onAddAnswer }: UserAnswersProps) {
  const { isLoading } = useLoading();

  const alreadyHasAnswer = answerGroup.entries.some((entry: any) => entry.playerId === user.id);

  const points = Object.values(user.answers).reduce((acc, answer: any) => {
    return acc + (answer?.score ?? 0);
  }, 0);

  return (
    <div className="m-step">
      <div className="m-step__contained-content">
        <Instruction contained>
          <Translate
            pt="Se você cometeu um erro ortográfico ou acha que sua resposta deveria estar no grupo acima, clique nela para adicioná-la. Você só pode ter uma resposta por pergunta!"
            en="If you made a typo or for some reason think your answer should be in this group, click on it to add it. You can only have one answer per question."
          />
          <br />
          <Translate pt={<>Você tem: {points} ponto(s)</>} en={<>You have: {points} point(s)</>} />
        </Instruction>

        <ButtonContainer className="m-user-answers">
          {Object.entries(user.answers).map(([key, answerObj]: any) => {
            return (
              <Button
                key={`a-b-${key}`}
                disabled={answerObj?.isLocked || alreadyHasAnswer || isLoading}
                className="m-user-answer"
                icon={answerObj.isLocked ? <LockFilled /> : <PlusCircleFilled />}
                onClick={() => onAddAnswer({ answer: { id: key, playerId: user.id, ...answerObj } })}
              >
                {answerObj.answer} {Boolean(answerObj.score) && `(${answerObj.score})`}
              </Button>
            );
          })}
        </ButtonContainer>
      </div>
    </div>
  );
}
