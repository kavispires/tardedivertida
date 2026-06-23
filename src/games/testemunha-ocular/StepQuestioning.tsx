// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
import type { SuspectCardData, TestimonyQuestionCardData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
import { useMock } from '@hooks/useMock';
// Components
import { AnswerNoButton, AnswerYesButton } from '@components/buttons/AnswerButtons';
import { Card } from '@components/cards/Card';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { ViewIf } from '@components/views/ViewIf';
// Internal
import type { Outcome, Status, SubmitTestimonyPayload, THistoryEntry } from './utils/types';
import { mockWitnessTestimony } from './utils/mock';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepQuestioningProps = {
  suspectsDict: Dictionary<SuspectCardData>;
  suspectsIds: UID[];
  previouslyEliminatedSuspects: string[];
  perpetratorId: UID;
  isUserTheWitness: boolean;
  witness: GamePlayer;
  isLoading: boolean;
  onAnswer: (payload: SubmitTestimonyPayload) => void;
  question: TestimonyQuestionCardData;
  history: THistoryEntry[];
  status: Status;
  outcome: Outcome;
} & Pick<StepProps, 'announcement'>;

export function StepQuestioning({
  suspectsDict,
  suspectsIds,
  previouslyEliminatedSuspects,
  perpetratorId,
  isUserTheWitness,
  witness,
  isLoading,
  onAnswer,
  question,
  history,
  announcement,
  status,
}: StepQuestioningProps) {
  const { translate } = useLanguage();

  useMock(() => {
    if (isUserTheWitness) {
      onAnswer({ testimony: mockWitnessTestimony() });
    }
  });

  return (
    <Step announcement={announcement}>
      <ViewIf condition={isUserTheWitness}>
        <StepTitle>
          <Translate
            pt={
              <>
                Testemunha <PlayerAvatarName player={witness} />, responda:
              </>
            }
            en={
              <>
                Witness <PlayerAvatarName player={witness} />, please answer:
              </>
            }
          />
        </StepTitle>
        <Flex
          align="center"
          className="margin"
          gap={12}
        >
          <AnswerNoButton
            onClick={() => onAnswer({ testimony: false })}
            disabled={!isUserTheWitness || isLoading}
          />

          <Card
            header={translate({ pt: 'O suspeito...', en: 'The perpetrator...' })}
            color="blue"
            className="t-card"
            size="large"
            footer={Array(question.level).fill('•').join('')}
          >
            {question.question}
          </Card>

          <AnswerYesButton
            onClick={() => onAnswer({ testimony: true })}
            disabled={!isUserTheWitness || isLoading}
          />
        </Flex>
      </ViewIf>

      <ViewIf condition={!isUserTheWitness}>
        <StepTitle>
          <Translate
            pt={
              <>
                A Testemunha <PlayerAvatarName player={witness} /> está analisando a pergunta.
              </>
            }
            en={
              <>
                The witness <PlayerAvatarName player={witness} /> is analyzing the question.
              </>
            }
          />
        </StepTitle>

        <SpaceContainer
          align="center"
          orientation="vertical"
        >
          <Card
            header={translate({ pt: 'O suspeito...', en: 'The perpetrator...' })}
            color="blue"
            className="t-card"
            size="large"
            footer={Array(question.level).fill('•').join('')}
          >
            {question.question}
          </Card>
        </SpaceContainer>

        <RuleInstruction type="wait">
          <Translate
            pt="Aguarde a testemunha responder."
            en="Wait for the witness to answer."
          />
        </RuleInstruction>
      </ViewIf>

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        perpetratorId={isUserTheWitness ? perpetratorId : undefined}
        eliminatedSuspects={previouslyEliminatedSuspects}
      />

      {history.length > 0 && (
        <QuestionsHistory
          history={history}
          suspectsDict={suspectsDict}
        />
      )}

      {status && <Summary status={status} />}
    </Step>
  );
}
