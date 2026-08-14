// Ant Design Resources
import { LockFilled, PlusCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useLoading } from '@hooks/useLoading';
// Components
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { AddAnswerPayload, AnswerEntry, AnswerGroupObject } from '../utils/types';

type UserAnswersProps = {
  answerGroup: AnswerGroupObject;
  user: GamePlayer;
  onAddAnswer: (payload: AddAnswerPayload) => void;
};

type UserAnswer = Pick<AnswerEntry, 'answer' | 'isLocked' | 'parsedAnswer' | 'score'>;

export function UserAnswers({ answerGroup, user, onAddAnswer }: UserAnswersProps) {
  const { isLoading } = useLoading();

  const answers: Dictionary<UserAnswer> = user.answers ?? {};

  const alreadyHasAnswer = answerGroup.entries.some((entry: AnswerEntry) => entry.playerId === user.id);

  const points = Object.values(answers).reduce((acc: number, answer: UserAnswer) => {
    return acc + Number(answer?.score ?? 0);
  }, 0);

  return (
    <SpaceContainer
      className="m-step__contained-content"
      vertical
    >
      <RuleInstruction type="rule">
        <Translate
          pt="Se você cometeu um erro ortográfico ou acha que sua resposta deveria estar no grupo acima, clique nela para adicioná-la. Você só pode ter uma resposta por pergunta!"
          en="If you made a typo or for some reason think your answer should be in this group, click on it to add it. You can only have one answer per question."
        />
        <br />
        <Translate
          pt={
            <>
              Você tem: <PointsHighlight value={points} />
            </>
          }
          en={
            <>
              You have: <PointsHighlight value={points} />
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer className="m-user-answers">
        {Object.entries(answers).map(([key, answerObj]) => {
          return (
            <Button
              key={`a-b-${key}`}
              disabled={answerObj?.isLocked || alreadyHasAnswer || isLoading}
              className="m-user-answer"
              icon={answerObj.isLocked ? <LockFilled /> : <PlusCircleFilled />}
              onClick={() =>
                onAddAnswer({
                  answer: {
                    id: key,
                    playerId: user.id,
                    answer: answerObj.answer ?? '',
                    score: answerObj.score ?? 0,
                    parsedAnswer: answerObj.parsedAnswer,
                    isLocked: answerObj.isLocked || false,
                  },
                })
              }
            >
              {answerObj.answer} {Boolean(answerObj.score) && `(${answerObj.score})`}
            </Button>
          );
        })}
      </SpaceContainer>
    </SpaceContainer>
  );
}
