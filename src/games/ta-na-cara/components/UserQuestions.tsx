// Ant Design Resources
import { Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromLetter } from 'utils/helpers';
// Components
import { Card } from 'components/cards';
import { FloatingHand } from 'components/general/FloatingHand';
import { Translate } from 'components/language';
// Internal
import type { QuestionsDictionary } from '../utils/types';

type UserQuestionsProps = {
  user: GamePlayer;
  questionsDict: QuestionsDictionary;
};

export function UserQuestions({ user, questionsDict }: UserQuestionsProps) {
  return (
    <FloatingHand
      title={
        <Translate
          pt="Suas Perguntas"
          en="Your Questions"
        />
      }
    >
      <Space>
        {(user.questions ?? []).map((questionId: CardId, index: number) => {
          return (
            <Card
              key={questionId}
              header={LETTERS[index]}
              color={getColorFromLetter(LETTERS[index])}
            >
              {questionsDict[questionId].question}
            </Card>
          );
        })}
      </Space>
    </FloatingHand>
  );
}
