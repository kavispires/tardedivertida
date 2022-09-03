// Ant Design Resources
import { Button, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Suspects } from './components/Suspects';
import { QuestionsHistory } from './components/QuestionsHistory';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Card } from 'components/cards';
import { SpeechBubbleAcceptedIcon } from 'components/icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'components/icons/SpeechBubbleDeclinedIcon';
import { IconAvatar } from 'components/icons/IconAvatar';

type StepSuspectEliminationProps = {
  suspects: Suspect[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetrator: Suspect;
  isUserTheWitness: boolean;
  isUserTheQuestioner: boolean;
  witness: GamePlayer;
  questioner: GamePlayer;
  isLoading: boolean;
  onEliminate: GenericFunction;
  question: GamePlayer;
  testimony: boolean;
  history: THistoryEntry[];
};

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
}: StepSuspectEliminationProps) {
  const { translate } = useLanguage();

  const onEliminateSuspect = (suspectId: string) => onEliminate({ suspectId, pass: false });
  const onPass = () => onEliminate({ suspectId: '', pass: true });

  return (
    <Step>
      <Title level={3} size="medium">
        <AvatarName player={witness} />
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
        <br />
        <Space className="space-container" align="center">
          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            color={testimony ? 'green' : 'red'}
            className="t-card"
          >
            {question.question}
          </Card>
        </Space>
      </Title>
      {isUserTheQuestioner ? (
        <Instruction contained>
          <Translate
            pt="Clique em um suspeito para liberá-lo(a)"
            en="Click on a suspect card to release it"
          />
          <br />
          {Boolean(eliminatedSuspects?.length && isUserTheQuestioner) && (
            <Space className="space-container" align="center">
              <Button type="primary" onClick={onPass} disabled={isLoading}>
                <Translate
                  pt="Parar de eliminar e ir para a próxima pergunta"
                  en="Stop releasing suspects and go to next question"
                />
              </Button>
            </Space>
          )}
        </Instruction>
      ) : (
        <Instruction contained>
          <AvatarName player={questioner} />{' '}
          <Translate pt="é quem libera os suspeitos" en="is who is releasing the suspects" />
        </Instruction>
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
