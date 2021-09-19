import React, { useState } from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useLanguage, useLoading } from '../../hooks';
// Design Resources
import { Button, Input } from 'antd';
// Components
import { ButtonContainer, Title, translate, Translate } from '../../components/shared';
import { ImageCard, ImageCardHand as Hand } from '../../components/cards';
import BookPages from './BookPages';

function StoryWriting({ user, onSubmitStory }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const [story, setStory] = useState('');
  const [cardId, setCardId] = useState('');

  const onButtonClick = () => {
    if (cardId && story) {
      onSubmitStory({
        action: 'SUBMIT_STORY',
        story: story.trim(),
        cardId,
      });
    }
  };

  return (
    <div className="c-story-writing">
      <Title>
        <Translate pt="Escreva uma história" en="Tell a story" />
      </Title>
      <div className="c-story-book">
        <BookPages
          leftPage={
            <div className="c-story-book__selected-card">
              {cardId && <ImageCard imageId={cardId} cardWidth={175} />}
            </div>
          }
          rightPage={
            <div className="c-story-book__instructions">
              <ul>
                <li>
                  <Translate
                    pt="Selecione uma carta abaixo e escreva algo sobre ela."
                    en="Select a card below and write something about it."
                  />
                </li>
                <li>
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
                <li>
                  <Input
                    className="c-story-writing-input"
                    placeholder={translate('Escreva aqui', 'Write your clue here', language)}
                    onChange={(e) => setStory(e.target.value)}
                    onPressEnter={onButtonClick}
                  />
                </li>
              </ul>
            </div>
          }
        />
      </div>

      <ButtonContainer className="c-input-container">
        <Button type="primary" disabled={isLoading || story.length < 1 || !cardId} onClick={onButtonClick}>
          <Translate pt="Enviar pista secreta e carta" en="Send secret clue and card" />
        </Button>
      </ButtonContainer>
      <Hand
        hand={user.hand}
        onSelectCard={setCardId}
        disabledSelectButton={isLoading}
        sizeRatio={user.hand.length}
      />
    </div>
  );
}

StoryWriting.propTypes = {
  onSubmitClue: PropTypes.func,
  user: PropTypes.shape({
    hand: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default StoryWriting;
