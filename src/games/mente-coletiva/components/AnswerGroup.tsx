import clsx from 'clsx';
// Ant Design Resources
import { LockFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Checkbox } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useHost } from 'hooks/useHost';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Card } from 'components/cards';
import { GroupQuestionCard } from 'components/cards/GroupQuestionCard';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { AnswerGroupObject, Question } from '../utils/types';
import { SheepAvatar } from './SheepAvatar';

type AnswerGroupProps = {
  currentQuestion: Question;
  answerGroup: AnswerGroupObject;
  players: GamePlayers;
  remainingGroupsCount: number;
  allowUserAnswer: (isAllowed: boolean, answerId: string) => void;
};

export function AnswerGroup({
  answerGroup,
  currentQuestion,
  players,
  allowUserAnswer,
  remainingGroupsCount,
}: AnswerGroupProps) {
  const { translate } = useLanguage();
  const isHost = useHost();

  return (
    <Step className="m-step">
      <Title
        level={3}
        size="small"
      >
        <Translate
          pt="Comparar Respostas"
          en="Compare Answers"
        />
      </Title>
      <Card
        header={translate('Pergunta', 'Question')}
        color={['yellow', 'orange', 'green', 'blue', 'purple'][remainingGroupsCount % 5]}
        className="m-question-card"
        footer={Array(remainingGroupsCount).fill('•').join('')}
      >
        <GroupQuestionCard question={currentQuestion} />
      </Card>

      <RuleInstruction type="rule">
        <Translate
          pt="Não existe resposta certa ou errada. Aqui, apenas agrupamos respostas iguais para ganhar pontos. O objetivo é pensar como o grupo!"
          en="There's no wrong or right answer. Here, we just group equal answers for points. The goal is to think like the group"
        />
      </RuleInstruction>

      <div className="m-answer-group">
        <div className="m-answer-group__answer-container">
          <div className="m-answer-group__answer">{answerGroup.answer}</div>
        </div>
        <ul className="m-answer-group__players">
          {answerGroup.entries.map((entry) => {
            const key = `ag-${entry.id}`;
            const player = players[entry.playerId];
            const isLocked =
              player.answers[entry.id].parsedAnswer === answerGroup.parsedAnswer ||
              player.answers[entry.id].isLocked;
            return (
              <li
                className="m-answer-group__player"
                key={key}
              >
                <SheepAvatar
                  id={player.avatarId}
                  sheepId={player.sheepId}
                  className="m-answer-group__sheep-avatar"
                  width={40}
                  animate
                />
                <span className="m-answer-group__player-name">
                  {player.name} {isLocked ? <LockFilled /> : <QuestionCircleFilled />}
                </span>
                {!isLocked && (
                  <span className={clsx('m-answer-group__speech-bubble-small', getAnimationClass('tada'))}>
                    {player.answers[entry.id].answer}
                  </span>
                )}
                {!isLocked && isHost && (
                  <div className="m-answer-group__allow-add">
                    <Checkbox
                      data-allowanswer={entry.id}
                      onChange={(e) => allowUserAnswer(e.target.checked, entry.id)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Step>
  );
}

export default AnswerGroup;
