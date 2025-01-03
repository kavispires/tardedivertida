// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
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
  suspects: SuspectCard[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetrator: SuspectCard;
  isUserTheWitness: boolean;
  isUserTheQuestioner: boolean;
  witness: GamePlayer;
  questioner: GamePlayer;
  onEliminate: (payload: EliminatePayload) => void;
  question: GamePlayer;
  testimony: boolean;
  history: THistoryEntry[];
  status: Status;
} & Pick<StepProps, 'announcement'>;

export function StepSuspectElimination({
  suspects,
  previouslyEliminatedSuspects,
  eliminatedSuspects,
  perpetrator,
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
  const { translate } = useLanguage();

  const onEliminateSuspect = (suspectId: string) => onEliminate({ suspectId, pass: false });
  const onPass = () => onEliminate({ suspectId: '', pass: true });

  return (
    <Step announcement={announcement}>
      <StepTitle>
        <span>
          <AvatarName player={witness} addressUser />
          <Translate en="answered" pt="respondeu" />{' '}
          {testimony ? (
            <Translate en="YES" pt="SIM" />
          ) : (
            <>
              <Translate en="NO" pt="NÃO" />
            </>
          )}{' '}
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
          {testimony ? '' : translate('não ', 'does not ')}
          {question.answer}
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
          <TextHighlight>
            {testimony ? translate('NÃO ', 'DOES NOT ') : ''} {question.answer}
          </TextHighlight>
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
          <AvatarName player={questioner} />{' '}
          <Translate
            pt="é quem libera os suspeitos e ele(a) precisa liberar pelo menos um."
            en="is the one who is releasing the suspects and they must release at least one."
          />
          <br />
          <Translate pt="E deve ser alguém que" en="It must someone that " />{' '}
          <TextHighlight>
            {testimony ? translate('NÃO ', 'DOES NOT ') : ''} {question.answer}
          </TextHighlight>
        </RuleInstruction>
      )}

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        onCardClick={isUserTheQuestioner ? onEliminateSuspect : undefined}
        eliminatedSuspects={[...(eliminatedSuspects ?? []), ...(previouslyEliminatedSuspects ?? [])]}
      />

      {history.length > 0 && <QuestionsHistory history={history} />}

      {status && <Summary status={status} />}
    </Step>
  );
}
