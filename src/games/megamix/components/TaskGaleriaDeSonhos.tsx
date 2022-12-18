import { Button, Image, Space } from 'antd';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useLoading } from 'hooks/useLoading';
import { MinigameTitle } from './MinigameTitle';
import { useMock } from 'hooks/useMock';
import { mockSelection } from '../utils/mock';
import { Card, ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';

export const TaskGaleriaDeSonhos = ({ task, round, onSubmitTask, user }: TaskProps) => {
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
    onSelect(mockSelection(task.data.cards));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>Com o tema abaixo, qual carta-sonho é a mais provável dos outros jogadores também visitarem?</>
          }
          en={<>With the theme below, what is the Dream Card most likely to be visited by other players?</>}
        />
      </Instruction>

      <Card header={translate('tema', 'theme')} color="orange">
        {task.data.theme.text}
      </Card>

      <Image.PreviewGroup>
        <Space className="space-container">
          {task.data.cards.map((cardId: ImageCardId) => {
            return (
              <Space className="space-container" direction="vertical">
                <ImageBlurButtonContainer cardId={cardId}>
                  <ImageCard imageId={cardId} cardWidth={cardWidth} />
                </ImageBlurButtonContainer>
                <Button
                  shape="round"
                  type="primary"
                  disabled={user.ready}
                  loading={isLoading}
                  onClick={() => onSelect(cardId)}
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
