import { Button, Image, Space } from 'antd';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useLoading } from 'hooks/useLoading';
import { MinigameTitle } from './MinigameTitle';
import { useMock } from 'hooks/useMock';
import { mockSelection } from '../utils/mock';
import { Card, ImageCard } from 'components/cards';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { IconAvatar } from 'components/icons/IconAvatar';
import { SpeechBubbleAcceptedIcon } from 'components/icons/SpeechBubbleAcceptedIcon';
import { SpeechBubbleDeclinedIcon } from 'components/icons/SpeechBubbleDeclinedIcon';

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
              A witness give this answer when trying to explain who the perpetrator was to the police.
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
              <Space className="space-container" direction="vertical">
                <div className="t-suspects-table__suspect t-suspects-table__suspect-button">
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
};
