// Ant Design Resources
import { Avatar, Button } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { AvatarName, ButtonContainer, Card, Icons, Instruction, Step, Title, Translate } from 'components';
import { Suspects } from './Suspects';
import { QuestionsHistory } from './QuestionsHistory';

type StepSuspectEliminationProps = {
  suspects: Suspect[];
  previouslyEliminatedSuspects: string[];
  eliminatedSuspects: string[];
  perpetrator: Suspect;
  isUserTheWitness: boolean;
  isUserTheQuestioner: boolean;
  witness: GamePlayer;
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
}: StepSuspectEliminationProps) {
  const { translate } = useLanguage();

  const onEliminateSuspect = (suspectId: string) => onEliminate({ suspectId, pass: false });
  const onPass = () => onEliminate({ suspectId: '', pass: true });

  return (
    <Step>
      <Title level={3}>
        <AvatarName player={witness} />
        <Translate en="answered" pt="respondeu" />{' '}
        {testimony ? (
          <Translate en="YES" pt="SIM" />
        ) : (
          <>
            <Translate en="NO" pt="NÃO" />
          </>
        )}{' '}
        <Avatar
          size="large"
          icon={testimony ? <Icons.SpeechBubbleAccepted /> : <Icons.SpeechBubbleDeclined />}
          style={{ backgroundColor: 'transparent' }}
          shape="square"
        />{' '}
        <Translate en="to the question" pt="para a pergunta:" />
        <br />
        <ButtonContainer>
          <Card
            header={translate('O suspeito...', 'The perpetrator...')}
            color={testimony ? 'green' : 'red'}
            className="t-card"
          >
            {question.question}
          </Card>
        </ButtonContainer>
      </Title>
      {isUserTheQuestioner && (
        <Instruction contained>
          <Translate
            pt="Clique em um suspeito para liberá-lo(a)"
            en="Click on a suspect card to release it"
          />
          <br />
          {Boolean(eliminatedSuspects?.length && isUserTheQuestioner) && (
            <ButtonContainer>
              <Button type="primary" onClick={onPass} disabled={isLoading}>
                <Translate
                  pt="Parar de eliminar e ir para a próxima pergunta"
                  en="Stop releasing suspects and go to next question"
                />
              </Button>
            </ButtonContainer>
          )}
        </Instruction>
      )}

      <Suspects
        suspects={suspects}
        perpetrator={isUserTheWitness ? perpetrator : undefined}
        onCardClick={isUserTheQuestioner ? onEliminateSuspect : undefined}
        eliminatedSuspects={[...(eliminatedSuspects ?? []), ...(previouslyEliminatedSuspects ?? [])]}
      />

      <QuestionsHistory history={history} />
    </Step>
  );
}
