// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Icons
// Components
import {
  AnswerKindaNoButton,
  AnswerMaybeYesButton,
  AnswerNoButton,
  AnswerYesButton,
} from 'components/buttons/AnswerButtons';
import { SuspectCard } from 'components/cards/SuspectCard';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhaseAnsweringState, SubmitAnswerPayload } from './utils/types';
import { mockAnswer } from './utils/mock';
import { Prompt } from './components/Prompt';

type StepAnswerTheQuestionProps = {
  players: GamePlayers;
  user: GamePlayer;
  onSubmitAnswer: (payload: SubmitAnswerPayload) => void;
} & Pick<
  PhaseAnsweringState,
  'grid' | 'identitiesDict' | 'currentQuestionId' | 'questionsDict' | 'vibesMode' | 'questionCount'
> &
  Pick<StepProps, 'announcement'>;

export function StepAnswerTheQuestion({
  players,
  user,
  announcement,
  onSubmitAnswer,
  identitiesDict,
  grid,
  currentQuestionId,
  questionsDict,
  vibesMode,
  questionCount,
}: StepAnswerTheQuestionProps) {
  const userIdentityId = user?.identity?.identityId;
  const suspect = identitiesDict[userIdentityId];
  const question = questionsDict[currentQuestionId];

  useMock(() => {
    onSubmitAnswer({
      questionId: currentQuestionId,
      answer: mockAnswer(),
    });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Responda" en="Answer the Question" />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Olhe para a cara do seu personagem e responsa com sinceridade. <br />
              Lembre-se que você ganha pontos se os outros jogadores acertarem o seu personagem
            </>
          }
          en={
            <>
              Look at your character's face and answer honestly.
              <br />
              Remember that you earn points if the other players guess your character correctly.
            </>
          }
        />
      </RuleInstruction>

      {question && suspect && (
        <>
          <Prompt question={question} />

          <Flex justify="center" align="center" gap={6} wrap>
            <div>
              <AnswerNoButton
                onClick={() =>
                  onSubmitAnswer({
                    questionId: currentQuestionId,
                    answer: -3,
                  })
                }
              />
            </div>
            <div>
              <AnswerKindaNoButton
                onClick={() =>
                  onSubmitAnswer({
                    questionId: currentQuestionId,
                    answer: -1,
                  })
                }
              />
            </div>

            <SuspectCard suspect={suspect} width={125} />

            <div>
              <AnswerMaybeYesButton
                onClick={() =>
                  onSubmitAnswer({
                    questionId: currentQuestionId,
                    answer: 1,
                  })
                }
              />
            </div>
            <div>
              <AnswerYesButton
                onClick={() =>
                  onSubmitAnswer({
                    questionId: currentQuestionId,
                    answer: 3,
                  })
                }
              />
            </div>
          </Flex>
        </>
      )}
    </Step>
  );
}
