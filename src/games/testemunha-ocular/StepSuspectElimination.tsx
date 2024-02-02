// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Types
import type { GamePlayer } from 'types/player';
import type { SuspectCard } from 'types/tdr';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';
// Components
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { AvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Card } from 'components/cards';

type StepSuspectEliminationProps = {
  suspects: SuspectCard[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetrator: SuspectCard;
  isUserTheWitness: boolean;
  isUserTheQuestioner: boolean;
  witness: GamePlayer;
  questioner: GamePlayer;
  isLoading: boolean;
  onEliminate: GenericFunction;
  question: GamePlayer;
  testimony: boolean;
  history: THistoryEntry[];
} & Pick<StepProps, 'announcement'>;

export function StepSuspectElimination({
  suspects,
  previouslyEliminatedSuspects,
  eliminatedSuspects,
  perpetrator,
  isUserTheWitness,
  isUserTheQuestioner,
  witness,
  isLoading,
  onEliminate,
  question,
  testimony,
  history,
  questioner,
  announcement,
}: StepSuspectEliminationProps) {
  const { translate } = useLanguage();

  const onEliminateSuspect = (suspectId: string) => onEliminate({ suspectId, pass: false });
  const onPass = () => onEliminate({ suspectId: '', pass: true });

  return (
    <Step announcement={announcement}>
      <Title level={3} size="medium">
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
      </Title>

      <Space className="space-container" align="center">
        <Card
          header={translate('O suspeito...', 'The perpetrator...')}
          color={testimony ? 'green' : 'red'}
          className="t-card"
          size="large"
        >
          {question.question}
        </Card>
      </Space>

      {isUserTheQuestioner ? (
        <RuleInstruction type="action">
          <Translate
            pt="Clique em um suspeito para liberá-lo(a)."
            en="Click on a suspect card to release it."
          />
          <br />
          {Boolean(eliminatedSuspects?.length && isUserTheQuestioner) && (
            <Button type="primary" onClick={onPass} disabled={isLoading}>
              <Translate
                pt="Parar de eliminar e ir para a próxima pergunta"
                en="Stop releasing suspects and go to next question"
              />
            </Button>
          )}
        </RuleInstruction>
      ) : (
        <RuleInstruction type="wait">
          <AvatarName player={questioner} />{' '}
          <Translate
            pt="é quem libera os suspeitos e ele(a) precisa liberar pelo menos um."
            en="is the one who is releasing the suspects and they must release at least one."
          />
        </RuleInstruction>
      )}

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        onCardClick={isUserTheQuestioner ? onEliminateSuspect : undefined}
        eliminatedSuspects={[...(eliminatedSuspects ?? []), ...(previouslyEliminatedSuspects ?? [])]}
      />

      {history.length > 0 && <QuestionsHistory history={history} />}
    </Step>
  );
}
