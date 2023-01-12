// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { Card, ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { CardHighlight } from 'components/metrics/CardHighlight';

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
            <>
              Com o tema abaixo, qual <CardHighlight>carta-sonho</CardHighlight> é a mais provável dos outros
              jogadores também visitarem?
            </>
          }
          en={
            <>
              With the theme below, what is the <CardHighlight>Dream Card</CardHighlight> most likely to be
              visited by other players?
            </>
          }
        />
      </Instruction>

      <Card header={translate('Tema', 'Theme')} color="orange">
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
