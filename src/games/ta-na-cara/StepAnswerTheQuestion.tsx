import { useState } from 'react';
// Ant Design Resources
import { Flex, Radio } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { SuspectCard as Suspect } from 'types/tdr';
// Hooks
import { useMock } from 'hooks/useMock';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SendButton, TransparentButton } from 'components/buttons';
import { AnswerNoButton, AnswerYesButton } from 'components/buttons/AnswerButtons';
import { DivButton } from 'components/buttons/DivButton';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCardSelectButton } from 'components/image-cards/ImageCardSelectButton';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
import { ViewOr } from 'components/views';
// Internal
import type {
  PhaseAnsweringState,
  PhaseIdentitySelectionState,
  PhasePromptingState,
  SubmitAnswerPayload,
  SubmitIdentityPayload,
  SubmitPromptPayload,
} from './utils/types';
import { mockAnswer, mockCharacterSelection } from './utils/mock';
import { Prompt } from './components/Prompt';
import { CharactersBoard } from './components/CharactersBoard';

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
                    answer: false,
                  })
                }
              />
            </div>

            <SuspectCard suspect={suspect} width={125} />

            <div>
              <AnswerYesButton
                onClick={() =>
                  onSubmitAnswer({
                    questionId: currentQuestionId,
                    answer: true,
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
