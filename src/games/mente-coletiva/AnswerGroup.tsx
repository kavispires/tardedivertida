// Design Resources
import { Checkbox } from 'antd';
import { LockFilled, QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLanguage } from '../../hooks';
// Components
import { Card, Instruction, SheepAvatar, Title, Translate } from '../../components';
import { Question } from './Question';

type AnswerGroupProps = {
  currentQuestion: MQuestion;
  answerGroup: AnswerGroup;
  players: GamePlayers;
  remainingGroupsCount: number;
  allowUserAnswer: GenericFunction;
};

export function AnswerGroup({
  answerGroup,
  currentQuestion,
  players,
  allowUserAnswer,
  remainingGroupsCount,
}: AnswerGroupProps) {
  const { translate } = useLanguage();
  const [isAdmin] = useGlobalState('isAdmin');

  return (
    <div className="m-step">
      <Title level={3}>
        <Translate pt="Comparar Respostas" en="Compare Answers" />
        <Card
          header={translate('Pergunta', 'Question')}
          color={['yellow', 'orange', 'green', 'blue', 'purple'][remainingGroupsCount % 5]}
          className="m-question-card"
          footer={Array(remainingGroupsCount).fill('•').join('')}
        >
          <Question question={currentQuestion} />
        </Card>
      </Title>

      <Instruction contained>
        <Translate
          pt="Não existe resposta certa ou errada. Aqui, apenas agrupamos respostas iguais para ganhar pontos. O objetivo é pensar como o grupo!"
          en="There's no wrong or right answer. Here, we just group equal answers for points. The goal is to think like the group"
        />
      </Instruction>

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
              <li className="m-answer-group__player" key={key}>
                <SheepAvatar
                  id={player.avatarId}
                  className="m-answer-group__sheep-avatar"
                  width={40}
                  animate
                />
                <span className="m-answer-group__player-name">
                  {player.name} {isLocked ? <LockFilled /> : <QuestionCircleFilled />}
                </span>
                {!isLocked && (
                  <span className="m-answer-group__speech-bubble-small">
                    {player.answers[entry.id].answer}
                  </span>
                )}
                {!isLocked && isAdmin && (
                  <div className="m-answer-group__allow-add">
                    <Checkbox
                      data-allowAnswer={entry.id}
                      onChange={(e) => allowUserAnswer(e.target.checked, entry.id)}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default AnswerGroup;
