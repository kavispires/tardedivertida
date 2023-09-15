import { useState } from 'react';
// AntDesign Resources
import { Button, Input } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockText } from '../../utils/mock';
// Components
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { BookPages } from 'games/contadores-historias/components/BookPages';
import { MinigameTitle } from '../MinigameTitle';

export const TrackContadoresHistorias = ({ track, round, onSubmitAnswer, user, players }: TrackProps) => {
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  const onSubmitClue = () => {
    if (clue.length > 1) {
      onSubmitAnswer({
        data: { value: clue },
      });
    }
  };

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockText() },
    });
  });
  return (
    <>
      <MinigameTitle title={{ pt: '', en: '' }} />

      <BookPages
        leftPage={
          <ImageBlurButtonContainer cardId={track.data.cardId}>
            <ImageCard imageId={track.data.cardId} cardWidth={150} />
          </ImageBlurButtonContainer>
        }
        rightPage={
          <div>
            <Instruction contained>
              <Translate
                pt={
                  <>
                    Escreva uma história para essa página do livro.
                    <br />
                    Seja bem óbvio e palavras únicas têm mais chances de dar match.
                  </>
                }
                en={
                  <>
                    Write a clue about this page of the book.
                    <br />
                    Be obvious and single-word clues have more chances of matching other players
                  </>
                }
              />
            </Instruction>
            <Input
              onChange={(e) => setClue(e.target.value)}
              onPressEnter={onSubmitClue}
              className="c-input"
            />
          </div>
        }
      />

      <Button
        shape="round"
        type="primary"
        disabled={user.ready || clue.length < 2}
        loading={isLoading}
        onClick={onSubmitClue}
      >
        <Translate pt="Enviar" en="Submit" />
      </Button>
    </>
  );
};
