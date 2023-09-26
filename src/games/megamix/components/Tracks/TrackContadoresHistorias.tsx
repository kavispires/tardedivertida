// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { mockSelection } from '../../utils/mock';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { BookPages } from 'components/game/BookPages';
import { MinigameTitle } from '../MinigameTitle';

export const TrackContadoresHistorias = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(8, { gap: 8, minWidth: 150, maxWidth: 350, margin: 8 });

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.cards));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Contadores de Histórias', en: 'Storytellers' }} />
      <Space direction="vertical" align="center" className="space-container contained margin">
        <Instruction contained>
          <Translate
            pt="Dada a dica abaixo, qual das cartas é a resposta correta?"
            en="Given the clue below, which card is the correct answer?"
          />
        </Instruction>

        <BookPages
          className="c-book-pages"
          leftPage={
            <Space className="space-container" direction="vertical" align="center">
              <ImageCard imageId="back-question" cardWidth={100} />
            </Space>
          }
          rightPage={<div className="c-book-content">{track.data?.prompt ?? track.data?.options ?? '?'}</div>}
        />

        <Image.PreviewGroup>
          <Space className="space-container">
            {track.data.cards.map((cardId: ImageCardId) => {
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
      </Space>
    </>
  );
};
