// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { Book } from 'games/porta-dos-desesperados/components/Book';
import { DoorFrame } from 'games/porta-dos-desesperados/components/DoorFrame';
import { MinigameTitle } from './MinigameTitle';

export const TaskPortaDosDesesperados = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const doorWidth = useCardWidth(8, 8, 150, 350, 8);
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitTask({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(task.data.doors));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={
            <>
              A pista está nas páginas do livro.
              <br />
              Selecione a porta correta que mais se relaciona com o livro.
            </>
          }
          en={
            <>
              The clue is in the pages of the book.
              <br />
              Select the door that best fits the clue.
            </>
          }
        />
      </Instruction>
      <Image.PreviewGroup>
        <Space className="space-container">
          {task.data.doors.map((cardId: ImageCardId) => {
            return (
              <Space className="space-container" direction="vertical" key={cardId}>
                <ImageBlurButtonContainer cardId={cardId}>
                  <DoorFrame width={doorWidth}>
                    <ImageCard imageId={cardId} cardWidth={150} />
                  </DoorFrame>
                </ImageBlurButtonContainer>
                <Button
                  shape="round"
                  type="primary"
                  disabled={user.ready}
                  loading={isLoading}
                  onClick={() => onSelect(cardId)}
                >
                  <Translate pt="Esse é a saída" en="This is the exit" />
                </Button>
              </Space>
            );
          })}
        </Space>
      </Image.PreviewGroup>

      <Space className="i-book-container">
        <Image.PreviewGroup>
          <Book>
            <ImageBlurButtonContainer cardId={task.data.book}>
              <ImageCard imageId={task.data.book[0]} cardWidth={140} />
            </ImageBlurButtonContainer>
            <ImageBlurButtonContainer cardId={task.data.book}>
              <ImageCard imageId={task.data.book?.[1] || task.data.book[0]} cardWidth={140} />
            </ImageBlurButtonContainer>
          </Book>
        </Image.PreviewGroup>
      </Space>
    </>
  );
};
