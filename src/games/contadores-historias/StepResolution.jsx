import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// Design Resources
import { Button, Avatar as AntAvatar } from 'antd';
// Hooks
import { useBlurCards, useDimensions, useLanguage } from '../../hooks';
// Components
import { Avatar, AvatarName } from '../../components/avatars';
import { ImageCard } from '../../components/cards';
import { ButtonContainer, TimedButton, Title, translate, Translate } from '../../components/shared';
import BookPages from './BookPages';

function StepResolution({ players, story, storyteller, table, setStep }) {
  const language = useLanguage();
  const [screenWidth] = useDimensions();
  const [blurredCards, addBlurCard, isFlavia] = useBlurCards();

  const solution = table.find((entry) => entry.playerId === storyteller.id);
  const otherCards = table.filter((entry) => entry.playerId !== storyteller.id);

  return (
    <div className="c-step-play-card">
      <Title>
        <Translate pt="Solução" en="Solution" />
      </Title>
      <div className="c-story-book">
        <BookPages
          leftPage={
            <div className="c-story-book__selected-card">
              {solution && <ImageCard imageId={solution.cardId} cardWidth={175} />}
            </div>
          }
          rightPage={
            <div className="c-story-book__solution">
              <p>
                <Translate pt="Era uma vez..." en="Once upon a time..." />
              </p>
              <p className="c-story-book__story">{story}</p>

              <div>
                <Translate pt="Votaram corretamente:" en="Voted correctly:" />
                <ul className="c-story-book__correct-players">
                  {solution &&
                    solution.votes
                      .filter((entry) => entry !== storyteller.id)
                      .map((playerId) => {
                        return (
                          <li key={`correct-vote-player-${playerId}`}>
                            <AvatarName player={players[playerId]} size="small" />
                          </li>
                        );
                      })}
                  {solution?.votes?.length < 2 && (
                    <li className="c-story-book__nobody">
                      <Translate pt="Vixi, ninguém acertou..." en="Well, nobody got it..." />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          }
        />
      </div>
      <ul className="c-other-cards">
        {otherCards.map((cardEntry, index) => {
          return (
            <li className="c-other-cards__entry" key={`other-card-votes-${cardEntry.playerId}-${index}`}>
              <div className="c-other-cards__player">
                {cardEntry.playerId === 'CPU' ? (
                  'CPU'
                ) : (
                  <AvatarName player={players[cardEntry.playerId]} size="small" />
                )}
              </div>

              <ImageCard
                imageId={cardEntry.cardId}
                cardWidth={Math.max(75, screenWidth / 16)}
                className={clsx(
                  'c-other-cards__card',
                  blurredCards?.[cardEntry.cardId] && 'c-game-table--blur'
                )}
              />
              {isFlavia && (
                <Button ghost onClick={() => addBlurCard(cardEntry.cardId)} size="small">
                  {translate('Credo', 'Blur', language)}
                </Button>
              )}

              <div className="c-other-cards__votes">
                <AntAvatar.Group size="small">
                  {cardEntry.votes.map((votePlayerId) => {
                    return (
                      <Avatar
                        id={players[votePlayerId].avatarId}
                        key={`incorrect-vote-player-${votePlayerId}`}
                      />
                    );
                  })}
                </AntAvatar.Group>
              </div>
            </li>
          );
        })}
      </ul>
      <ButtonContainer>
        <TimedButton
          onClick={() => setStep(2)}
          onExpire={() => setStep(2)}
          duration={20}
          label={translate('Continuar', 'Continue', language)}
        />
      </ButtonContainer>
    </div>
  );
}

StepResolution.propTypes = {
  players: PropTypes.object,
  setStep: PropTypes.func,
  story: PropTypes.string,
  storyteller: PropTypes.shape({
    id: PropTypes.string,
  }),
  table: PropTypes.arrayOf(
    PropTypes.shape({
      playerId: PropTypes.string,
      cardId: PropTypes.string,
      votes: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default StepResolution;
