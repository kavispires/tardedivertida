import { Button, Input } from 'antd';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { BookPages } from 'games/contadores-historias/components/BookPages';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useState } from 'react';
import { MinigameTitle } from './MinigameTitle';
import { mockText } from '../utils/mock';

export const TaskContadoresHistorias = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const { isLoading } = useLoading();
  const [clue, setClue] = useState('');

  const onSubmitClue = () => {
    if (clue.length > 1) {
      onSubmitTask({
        data: { value: clue },
      });
    }
  };

  // DEV Mock
  useMock(() => {
    onSubmitTask({
      data: { value: mockText() },
    });
  });
  return (
    <>
      <MinigameTitle round={round} task={task} />

      <BookPages
        leftPage={
          <ImageBlurButtonContainer cardId={task.data.cardId}>
            <ImageCard imageId={task.data.cardId} cardWidth={150} />
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
