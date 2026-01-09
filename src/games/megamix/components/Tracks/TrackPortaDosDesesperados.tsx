import { Book } from 'games/porta-dos-desesperados/components/Book';
// Ant Design Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { DoorFrame } from 'components/game/DoorFrame';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackPortaDosDesesperados = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const doorWidth = useCardWidth(8, { gap: 8, minWidth: 150, maxWidth: 350, margin: 8 });
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.doors));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Porta dos Desesperados', en: 'Obscure Doors' }} />
      <RuleInstruction type="action">
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
      </RuleInstruction>

      <Space className="i-book-container">
        <Image.PreviewGroup>
          <Book>
            <ImageBlurButtonContainer cardId={track.data.book}>
              <ImageCard
                cardId={track.data.book[0]}
                cardWidth={140}
              />
            </ImageBlurButtonContainer>
            <ImageBlurButtonContainer cardId={track.data.book}>
              <ImageCard
                cardId={track.data.book?.[1] || track.data.book[0]}
                cardWidth={140}
              />
            </ImageBlurButtonContainer>
          </Book>
        </Image.PreviewGroup>
      </Space>
      <Image.PreviewGroup>
        <SpaceContainer>
          {track.data.doors.map((cardId: ImageCardId) => {
            return (
              <SpaceContainer
                vertical
                key={cardId}
              >
                <ImageBlurButtonContainer cardId={cardId}>
                  <DoorFrame width={doorWidth}>
                    <ImageCard
                      cardId={cardId}
                      cardWidth={150}
                    />
                  </DoorFrame>
                </ImageBlurButtonContainer>
                <Button
                  shape="round"
                  type="primary"
                  disabled={user.ready}
                  loading={isLoading}
                  onClick={() => onSelect(cardId)}
                >
                  <Translate
                    pt="Esse é a saída"
                    en="This is the exit"
                  />
                </Button>
              </SpaceContainer>
            );
          })}
        </SpaceContainer>
      </Image.PreviewGroup>
    </>
  );
};
