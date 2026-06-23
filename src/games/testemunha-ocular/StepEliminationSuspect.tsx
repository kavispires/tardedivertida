import { useMemo } from 'react';
// Types
import type { GamePlayer } from 'types/game';
import type { SuspectCardData, TestimonyQuestionCardData } from 'types/tdr';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from '@icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from '@icons/SpeechBubbleDeclinedIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { EliminatePayload, Status, THistoryEntry } from './utils/types';
import { buildAnswer } from './utils/helpers';
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Summary } from './components/Summary';

type StepEliminationSuspectProps = {
  suspectsDict: Dictionary<SuspectCardData>;
  suspectsIds: UID[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetratorId: UID;
  isUserTheWitness: boolean;
  isUserTheQuestioner: boolean;
  witness: GamePlayer;
  questioner: GamePlayer;
  onEliminate: (payload: EliminatePayload) => void;
  question: TestimonyQuestionCardData;
  testimony: boolean;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepEliminationSuspect({
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
}: StepEliminationSuspectProps) {
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
          <PlayerAvatarName
            player={witness}
            addressUser
          />
          <Translate
            en="answered"
            pt="respondeu"
          />{' '}
          {testimony ? (
            <Translate
              en="YES"
              pt="SIM"
            />
          ) : (
            <Translate
              en="NO"
              pt="NÃO"
            />
          )}{' '}
          <Icon
            size="large"
            icon={testimony ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
          />{' '}
          <Translate
            en="to the question"
            pt="para a pergunta:"
          />
        </span>
      </StepTitle>

      <SpaceContainer align="center">
        <Card
          header={translate({ pt: 'O suspeito...', en: 'The perpetrator...' })}
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
          <Translate
            pt="Selecione alguém que"
            en="Select someone that "
          />{' '}
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
          <TextHighlight>
            <Translate
              pt="Quem"
              en="Who"
            />{' '}
            {oppositeAction}?
          </TextHighlight>
        </RuleInstruction>
      )}

      <Suspects
        suspectsDict={suspectsDict}
        suspectsIds={suspectsIds}
        perpetratorId={isUserTheWitness ? perpetratorId : undefined}
        onCardClick={isUserTheQuestioner ? onEliminateSuspect : undefined}
        eliminatedSuspects={[...(eliminatedSuspects ?? []), ...(previouslyEliminatedSuspects ?? [])]}
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
