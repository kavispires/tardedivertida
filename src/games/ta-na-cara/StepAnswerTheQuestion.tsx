// Ant Design Resources
import { Flex, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Components
import {
  AnswerKindaNoButton,
  AnswerMaybeYesButton,
  AnswerNoButton,
  AnswerYesButton,
} from 'components/buttons/AnswerButtons';
import { Translate } from 'components/language/Translate';
import { Step, type StepProps } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
import { Title } from 'components/text/Title';
// Internal
import type { SubmitAnswerPayload } from './utils/types';
import { CharactersBoard } from './components/CharactersBoard';
import { QuestionHistory } from './components/QuestionHistory';

type StepAnswerTheQuestionProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: TurnOrder;
  characters: SuspectCard[];
  questionsHistory: TestimonyQuestionCard[];
  activePlayer: GamePlayer;
  onSubmitAnswer: (payload: SubmitAnswerPayload) => void;
  currentQuestion: TestimonyQuestionCard;
} & Pick<StepProps, 'announcement'>;

export function StepAnswerTheQuestion({
  players,
  user,
  announcement,
  characters,
  questionsHistory,
  onSubmitAnswer,
  currentQuestion,
}: StepAnswerTheQuestionProps) {
  // Dev Mock
  // useMock(() => {
  //   onSubmitAnswer({ answer: mockAnswer() });
  // });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Todos, respondam:"
          en="Everyone, answer:"
        />
      </StepTitle>

      <div className="answer-board">
        <Title
          colorScheme="light"
          size="x-small"
          level={3}
          className="answer-board__question"
        >
          {currentQuestion.question}
        </Title>

        <Flex gap={6}>
          <AnswerNoButton
            onClick={() => user.currentAnswer === undefined && onSubmitAnswer({ answer: -2 })}
            disabled={user.currentAnswer && user.currentAnswer !== -2}
          />
          <AnswerKindaNoButton
            onClick={() => user.currentAnswer === undefined && onSubmitAnswer({ answer: -1 })}
            disabled={user.currentAnswer && user.currentAnswer !== -1}
          />
          <AnswerMaybeYesButton
            onClick={() => user.currentAnswer === undefined && onSubmitAnswer({ answer: 1 })}
            disabled={user.currentAnswer && user.currentAnswer !== 1}
          />
          <AnswerYesButton
            onClick={() => user.currentAnswer === undefined && onSubmitAnswer({ answer: 2 })}
            disabled={user.currentAnswer && user.currentAnswer !== 2}
          />
        </Flex>
      </div>

      <Space align="start">
        <CharactersBoard
          characters={characters}
          players={players}
          user={user}
        />
        <QuestionHistory
          players={players}
          questionsHistory={questionsHistory}
        />
      </Space>
    </Step>
  );
}
