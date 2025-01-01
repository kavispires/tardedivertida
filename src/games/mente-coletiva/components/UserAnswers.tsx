// Ant Design Resources
import { LockFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { RuleInstruction } from 'components/text';

type UserAnswersProps = {
  answerGroup: any;
  user: GamePlayer;
  onAddAnswer: GenericFunction;
};

export function UserAnswers({ answerGroup, user, onAddAnswer }: UserAnswersProps) {
  const { isLoading } = useLoading();

  const answers = user.answers ?? {};

  const alreadyHasAnswer = answerGroup.entries.some((entry: any) => entry.playerId === user.id);

  const points = Object.values(answers).reduce((acc: number, answer: any) => {
    return acc + Number(answer?.score ?? 0);
  }, 0);

  return (
    <div className="m-step">
      <div className="m-step__contained-content">
        <RuleInstruction type="rule">
          <Translate
            pt="Se você cometeu um erro ortográfico ou acha que sua resposta deveria estar no grupo acima, clique nela para adicioná-la. Você só pode ter uma resposta por pergunta!"
            en="If you made a typo or for some reason think your answer should be in this group, click on it to add it. You can only have one answer per question."
          />
          <br />
          <Translate
            pt={
              <>
                Você tem: <PointsHighlight>{points}</PointsHighlight> ponto(s)
              </>
            }
            en={
              <>
                You have:<PointsHighlight>{points}</PointsHighlight> point(s)
              </>
            }
          />
        </RuleInstruction>

        <SpaceContainer className="m-user-answers">
          {Object.entries(answers).map(([key, answerObj]: any) => {
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
        </SpaceContainer>
      </div>
    </div>
  );
}
