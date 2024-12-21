// Ant Design Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { BookPages } from 'components/game/BookPages';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
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
        <RuleInstruction type="action">
          <Translate
            pt="A dica abaixo se relaciona à uma das images, qual das cartas é correta?"
            en="The hint below relates to one of the images, which card is correct?"
          />
        </RuleInstruction>

        <BookPages
          className="c-book-pages"
          leftPage={
            <Space className="space-container" direction="vertical" align="center">
              <ImageCard id="back-question" cardWidth={100} />
            </Space>
          }
          rightPage={<div className="c-book-content">{track.data?.prompt ?? track.data?.options ?? '?'}</div>}
        />

        <Image.PreviewGroup>
          <Space className="space-container">
            {track.data.cards.map((cardId: ImageCardId) => {
              return (
                <Space key={cardId} className="space-container" direction="vertical">
                  <ImageBlurButtonContainer cardId={cardId}>
                    <ImageCard id={cardId} cardWidth={cardWidth} />
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
