import clsx from 'clsx';
// Ant Design Resources
import { Button, Image } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { AVATARS, BOTS_LIST } from 'utils/avatars';
// Components
import { PlayerAvatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackDetetivesImaginativos = ({ track, onSubmitAnswer, user }: TrackProps) => {
  const cardWidth = useCardWidth(7, { minWidth: 200, maxWidth: 270 });
  const { language } = useLanguage();
  const { isLoading } = useLoading();

  // DEV Mock
  useMock(() => {
    onSubmitAnswer({
      data: { value: mockSelection(track.data.cards) },
    });
  });

  if (track.variant === 'impostor') {
    return (
      <>
        <MinigameTitle title={{ pt: 'Detetives Imaginativos', en: 'Detective Agency' }} />
        <RuleInstruction type="action">
          <Translate
            pt={
              <>
                Você é o impostor e não sabe a palavra-secreta. Os outros jogadores escolheram as cartas
                abaixo que supostamente combinam com a palavra-secreta.
              </>
            }
            en={
              <>
                You are the impostor and don't know the secret clue. The other players played the cards below
                and they all supposed to match the secret clue.
              </>
            }
          />
        </RuleInstruction>

        <Image.PreviewGroup>
          <ul className="d-table">
            {track.data.table.map((cardId: ImageCardId, index: number) => {
              const bot = BOTS_LIST[index];
              return (
                <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
                  <ImageBlurButtonContainer
                    cardId={cardId}
                    className={clsx(
                      'd-table__card',
                      user?.data?.value === cardId && 'd-table__card--selected',
                    )}
                  >
                    <ImageCard
                      key={`table-focus-${cardId}`}
                      cardId={cardId}
                      cardWidth={cardWidth * 0.6}
                      className="d-table__image-card"
                    />
                  </ImageBlurButtonContainer>

                  <div className="d-table__player-info">
                    <PlayerAvatar avatarId={bot.avatarId} className="d-table__player-avatar" size="default" />
                    <span
                      className="d-table__player-bar"
                      style={{ backgroundColor: AVATARS[bot.avatarId].color }}
                    />
                    <span className="d-table__player-name">
                      {bot.name}, {AVATARS[bot.avatarId].description[language]}
                    </span>
                  </div>
                </div>
              );
            })}
          </ul>
        </Image.PreviewGroup>

        <RuleInstruction type="action">
          <Translate
            pt={<>Qual das suas cartas você usaria para passar despercebido?</>}
            en={<>Which card in your hand would play so you can blend in with the others?</>}
          />
        </RuleInstruction>

        <Image.PreviewGroup>
          <SpaceContainer>
            {track.data.cards.map((cardId: ImageCardId) => {
              return (
                <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
                  <ImageBlurButtonContainer
                    cardId={cardId}
                    className={clsx(
                      'd-table__card',
                      user?.data?.value === cardId && 'd-table__card--selected',
                    )}
                  >
                    <ImageCard
                      key={`table-focus-${cardId}`}
                      cardId={cardId}
                      cardWidth={cardWidth * 0.75}
                      className="d-table__image-card"
                    />
                  </ImageBlurButtonContainer>

                  <SpaceContainer>
                    <Button
                      shape="round"
                      type="primary"
                      disabled={user.ready}
                      loading={isLoading}
                      onClick={() =>
                        onSubmitAnswer({
                          data: { value: cardId },
                        })
                      }
                    >
                      <Translate pt="Selecionar" en="Select" />
                    </Button>
                  </SpaceContainer>
                </div>
              );
            })}
          </SpaceContainer>
        </Image.PreviewGroup>
      </>
    );
  }

  return (
    <>
      <MinigameTitle title={{ pt: 'Detetives Imaginativos', en: 'Detective Agency' }} />
      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Dentre as cartas abaixo, uma delas é do impostor! Você sabe qual é?
              <br />
              Selecione a carta que você acha <strong>NÃO</strong> combina com as outras duas.
            </>
          }
          en={
            <>
              Among the cards below, one belongs to the impostor! Do you know which one?
              <br />
              Select the card that does <strong>NOT</strong> match the others.
            </>
          }
        />
      </RuleInstruction>

      <Image.PreviewGroup>
        <ul className="d-table">
          {track.data.cards.map((cardId: ImageCardId, index: number) => {
            const bot = BOTS_LIST[index];
            return (
              <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
                <ImageBlurButtonContainer
                  cardId={cardId}
                  className={clsx('d-table__card', user?.data?.value === cardId && 'd-table__card--selected')}
                >
                  <ImageCard
                    key={`table-focus-${cardId}`}
                    cardId={cardId}
                    cardWidth={cardWidth}
                    className="d-table__image-card"
                  />
                </ImageBlurButtonContainer>

                <div className="d-table__player-info">
                  <PlayerAvatar avatarId={bot.avatarId} className="d-table__player-avatar" size="default" />
                  <span
                    className="d-table__player-bar"
                    style={{ backgroundColor: AVATARS[bot.avatarId].color }}
                  />
                  <span className="d-table__player-name">
                    {bot.name}, {AVATARS[bot.avatarId].description[language]}
                  </span>
                </div>
                <SpaceContainer>
                  <Button
                    shape="round"
                    type="primary"
                    disabled={user.ready}
                    loading={isLoading}
                    onClick={() =>
                      onSubmitAnswer({
                        data: { value: cardId },
                      })
                    }
                  >
                    <Translate pt="Esse é o impostor" en="This is the impostor" />
                  </Button>
                </SpaceContainer>
              </div>
            );
          })}
        </ul>
      </Image.PreviewGroup>
    </>
  );
};
