import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard, TestimonyQuestionCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { PlayerAvatarName, IconAvatar } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, TextHighlight, StepTitle } from 'components/text';
// Internal
import type { EliminatePayload, Status, THistoryEntry } from './utils/types';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepSuspectEliminationProps = {
  suspectsDict: Dictionary<SuspectCard>;
  suspectsIds: CardId[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetratorId: CardId;
  isUserTheWitness: boolean;
  isUserTheQuestioner: boolean;
  witness: GamePlayer;
  questioner: GamePlayer;
  onEliminate: (payload: EliminatePayload) => void;
  question: TestimonyQuestionCard;
  testimony: boolean;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepSuspectElimination({
  suspectsDict,
  suspectsIds,
  previouslyEliminatedSuspects,
  eliminatedSuspects,
  perpetratorId,
  isUserTheWitness,
  isUserTheQuestioner,
  witness,
  onEliminate,
  question,
  testimony,
  history,
  questioner,
  announcement,
  status,
}: StepSuspectEliminationProps) {
  const { translate, language } = useLanguage();

  const onEliminateSuspect = (suspectId: string) => onEliminate({ suspectId, pass: false });
  const onPass = () => onEliminate({ suspectId: '', pass: true });

  const { answer, oppositeAction } = useMemo(() => {
    const answer = buildAnswer(question, testimony, language);
    const oppositeAction = buildAnswer(question, !testimony, language);
    return { answer, oppositeAction };
  }, [question, testimony, language]);

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <span>
          <PlayerAvatarName player={witness} addressUser />
          <Translate en="answered" pt="respondeu" />{' '}
          {testimony ? <Translate en="YES" pt="SIM" /> : <Translate en="NO" pt="NÃO" />}{' '}
          <IconAvatar
            size="large"
            icon={testimony ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
          />{' '}
          <Translate en="to the question" pt="para a pergunta:" />
        </span>
      </StepTitle>

      <SpaceContainer align="center">
        <Card
          header={translate('O suspeito...', 'The perpetrator...')}
          color={testimony ? 'green' : 'red'}
          className="t-card"
          size="large"
        >
          {answer}
        </Card>
      </SpaceContainer>

      {isUserTheQuestioner ? (
        <RuleInstruction type="action">
          <Translate
            pt="Clique em um suspeito para liberá-lo(a)."
            en="Click on a suspect card to release it."
          />
          <br />
          <Translate pt="Selecione alguém que" en="Select someone that " />{' '}
          <TextHighlight>{oppositeAction}</TextHighlight>
          <br />
          {Boolean(eliminatedSuspects?.length && isUserTheQuestioner) && (
            <SendButton onClick={onPass}>
              <Translate
                pt="Parar de eliminar e ir para a próxima pergunta"
                en="Stop releasing suspects and go to next question"
              />
            </SendButton>
          )}
        </RuleInstruction>
      ) : (
        <RuleInstruction type="wait">
          <PlayerAvatarName player={questioner} />{' '}
          <Translate
            pt="é quem libera os suspeitos e ele(a) precisa liberar pelo menos um."
            en="is the one who is releasing the suspects and they must release at least one."
          />
          <br />
          <Translate pt="E deve ser alguém que" en="It must someone that " />{' '}
          <TextHighlight>{oppositeAction}</TextHighlight>
        </RuleInstruction>
      )}

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        perpetratorId={isUserTheWitness ? perpetratorId : undefined}
        onCardClick={isUserTheQuestioner ? onEliminateSuspect : undefined}
        eliminatedSuspects={[...(eliminatedSuspects ?? []), ...(previouslyEliminatedSuspects ?? [])]}
      />

      {history.length > 0 && <QuestionsHistory history={history} suspectsDict={suspectsDict} />}

      {status && <Summary status={status} />}
    </Step>
  );
}

const buildAnswer = (question: TestimonyQuestionCard, testimony: boolean, language: string) => {
  if (language === 'pt') {
    if (testimony) {
      return question.answer;
    }
    if (question.answer.startsWith('Já')) {
      return `nunca ${question.answer.slice(3)}`;
    }
    return `não ${question.answer}`;
  }

  if (language === 'en') {
    if (testimony) {
      return question.answer;
    }
    if (question.question.includes('ever')) {
      return `haver never ${question.answer.slice(5)}`;
    }
    return `does not ${question.answer}`;
  }

  return '';
};
