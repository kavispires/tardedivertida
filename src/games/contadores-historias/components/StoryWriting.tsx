import { useState } from 'react';
// Ant Design Resources
import { Input } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { ImageCard, ImageCardHand } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import { mockStory } from '../utils/mock';
import type { SubmitStoryPayload } from '../utils/types';
import { BookPages } from '../../../components/game/BookPages';

type StoryWritingProps = {
  user: GamePlayer;
  onSubmitStory: (payload: SubmitStoryPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StoryWriting({ user, onSubmitStory, announcement }: StoryWritingProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const [story, setStory] = useState('');
  const [cardId, setCardId] = useState('');

  const onButtonClick = () => {
    if (cardId && story) {
      onSubmitStory({
        story: story.trim(),
        cardId,
      });
    }
  };

  useMock(() => {
    onSubmitStory(mockStory(user.hand));
  }, []);

  return (
    <Step fullWidth className="c-story-writing" announcement={announcement}>
      <StepTitle>
        <Translate pt="Escreva uma história" en="Tell us a story" />
      </StepTitle>
      <div className="c-story-book">
        <BookPages
          leftPage={
            <div className="c-story-book__selected-card">
              {cardId && <ImageCard id={cardId} cardWidth={175} />}
            </div>
          }
          rightPage={
            <div className="c-story-book__instructions">
              <ul>
                <li>
                  <Translate
                    pt="Selecione uma carta abaixo e escreva algo sobre ela. "
                    en="Select a card below and write something about it. "
                  />

                  <Translate
                    pt="Escreva o que você quiser: uma frase, uma palavra única, uma expressão, letra de música. Não há restrições."
                    en="Write whatever you want: a sentence, a single word, an expression, a song lyric. There are no restrictions."
                  />
                </li>
                <li>
                  <Translate
                    pt="Pense em algo que ajudará os outros jogadores a escolher a carta selecionada. Não seja óbvio, se todos escolherem a carta correta você não ganha pontos, e não seja muito vago porque se ninguém acerta, você também fica sem pontos."
                    en="You want something that will help players to find the selected card. Don't be too obvious, because if all players guess correctly you get no points. And also don't be too vague, if nobody guesses the card you also get no points."
                  />
                </li>
              </ul>
            </div>
          }
        />
      </div>

      <SpaceContainer className="c-input-container" wrap>
        <Input
          placeholder={translate('Escreva aqui', 'Write your clue here')}
          onChange={(e) => setStory(e.target.value)}
          onPressEnter={onButtonClick}
          size="large"
        />
        <SendButton disabled={story.length < 1 || !cardId} onClick={onButtonClick} size="large">
          <Translate pt="Enviar história e carta" en="Send secret clue and card" />
        </SendButton>
      </SpaceContainer>

      <ImageCardHand
        hand={user.hand}
        onSelectCard={setCardId}
        disabledSelectButton={isLoading}
        sizeRatio={user.hand?.length}
      />
    </Step>
  );
}
