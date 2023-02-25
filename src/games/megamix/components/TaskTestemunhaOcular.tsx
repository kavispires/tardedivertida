// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { Card, ImageCard } from 'components/cards';
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'icons/SpeechBubbleDeclinedIcon';

export const TaskTestemunhaOcular = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const cardWidth = useCardWidth(8, 8, 150, 350, 8);
  const { isLoading } = useLoading();
  const { translate } = useLanguage();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(task.data.suspects, 'id'));
  });

  if (task.variant === 'suspects') {
    return (
      <>
        <MinigameTitle round={round} task={task} />
        <Instruction contained>
          <Translate
            pt={
              <>
                Uma testemunha deu essa resposta ao tentar falar quem era o criminoso à polícia.
                <br />
                Qual dos suspeito você acha que é o criminoso?
              </>
            }
            en={
              <>
                A witness gave this answer when trying to explain who the perpetrator was to the police.
                <br />
                Which one of them is the perpetrator?
              </>
            }
          />
        </Instruction>

        <Card header={translate('Pergunta', 'Question')} color="orange">
          {task.data.question.question}
        </Card>

        <Space className="space-container">
          {task.data.answer ? (
            <Translate en="YES" pt="SIM" />
          ) : (
            <>
              <Translate en="NO" pt="NÃO" />
            </>
          )}{' '}
          <IconAvatar
            size="large"
            icon={task.data.answer ? <SpeechBubbleAcceptedIcon /> : <SpeechBubbleDeclinedIcon />}
          />
        </Space>

        <Image.PreviewGroup>
          <Space className="space-container">
            {task.data.suspects.map((suspect: PlainObject) => {
              return (
                <Space className="space-container" direction="vertical" key={suspect.id}>
                  <div className="t-suspects-table__suspect">
                    <ImageCard
                      imageId={suspect.id}
                      className="t-suspects-table__suspect-image"
                      cardWidth={cardWidth}
                      preview={false}
                    />
                    <div className="t-suspects-table__suspect-name">
                      <DualTranslate>{suspect.name}</DualTranslate>
                    </div>
                  </div>

                  <Button
                    shape="round"
                    type="primary"
                    disabled={user.ready}
                    loading={isLoading}
                    onClick={() => onSelect(suspect.id)}
                  >
                    <Translate pt="Selecionar" en="Select" />
                  </Button>
                </Space>
              );
            })}
          </Space>
        </Image.PreviewGroup>
      </>
    );
  }

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              Você é a testemunha de um crime horrível. O detetive te fez essa pergunta sobre esse suspeito.
              <br />O que você responde?
            </>
          }
          en={
            <>
              You're the witness of a horrible crime. The detective asked you this question about the suspect.
              <br />
              what do you answer?
            </>
          }
        />
      </Instruction>

      <Card header={translate('Pergunta', 'Question')} color="orange">
        {task.data.question.question}
      </Card>

      <Space className="space-container" direction="vertical">
        <ImageCard
          imageId={task.data.suspect.id}
          className="t-suspects-table__suspect-image"
          cardWidth={cardWidth}
          preview={false}
        />
        <div className="t-suspects-table__suspect-name">
          <DualTranslate>{task.data.suspect.name}</DualTranslate>
        </div>
      </Space>

      <Space className="space-container">
        <Button size="large" icon={<SpeechBubbleDeclinedIcon />} onClick={() => onSelect('NO')}>
          <Translate en="NO" pt="NÃO" />
        </Button>

        <Button size="large" icon={<SpeechBubbleAcceptedIcon />} onClick={() => onSelect('YES')}>
          <Translate en="YES" pt="SIM" />
        </Button>
      </Space>
    </>
  );
};
