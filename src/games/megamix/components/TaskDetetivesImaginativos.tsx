import clsx from 'clsx';
// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { AVATARS, BOTS_LIST } from 'utils/avatars';
import { mockSelection } from '../utils/mock';
// Components
import { Avatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';

export const TaskDetetivesImaginativos = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const cardWidth = useCardWidth(7, 32, 200, 270);
  const { language } = useLanguage();
  const { isLoading } = useLoading();

  // DEV Mock
  useMock(() => {
    onSubmitTask({
      data: { value: mockSelection(task.data.cards) },
    });
  });

  if (task.variant === 'impostor') {
    return (
      <>
        <MinigameTitle round={round} task={task} />
        <Instruction contained>
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
        </Instruction>

        <Image.PreviewGroup>
          <ul className="d-table">
            {task.data.table.map((cardId: ImageCardId, index: number) => {
              const bot = BOTS_LIST[index];
              return (
                <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
                  <ImageBlurButtonContainer
                    cardId={cardId}
                    className={clsx(
                      'd-table__card',
                      user?.data?.value === cardId && 'd-table__card--selected'
                    )}
                  >
                    <ImageCard
                      key={`table-focus-${cardId}`}
                      imageId={cardId}
                      cardWidth={cardWidth * 0.6}
                      className="d-table__image-card"
                    />
                  </ImageBlurButtonContainer>

                  <div className="d-table__player-info">
                    <Avatar id={bot.avatarId} className="d-table__player-avatar" size="default" />
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

        <Instruction contained>
          <Translate
            pt={<>Qual das suas cartas você usaria para passar despercebido?</>}
            en={<>Which card in your hand would play so you can blend in with the others?</>}
          />
        </Instruction>

        <Image.PreviewGroup>
          <Space className="space-container">
            {task.data.cards.map((cardId: ImageCardId) => {
              return (
                <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
                  <ImageBlurButtonContainer
                    cardId={cardId}
                    className={clsx(
                      'd-table__card',
                      user?.data?.value === cardId && 'd-table__card--selected'
                    )}
                  >
                    <ImageCard
                      key={`table-focus-${cardId}`}
                      imageId={cardId}
                      cardWidth={cardWidth * 0.75}
                      className="d-table__image-card"
                    />
                  </ImageBlurButtonContainer>

                  <Space className="space-container">
                    <Button
                      shape="round"
                      type="primary"
                      disabled={user.ready}
                      loading={isLoading}
                      onClick={() =>
                        onSubmitTask({
                          data: { value: cardId },
                        })
                      }
                    >
                      <Translate pt="Selecionar" en="Select" />
                    </Button>
                  </Space>
                </div>
              );
            })}
          </Space>
        </Image.PreviewGroup>
      </>
    );
  }

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
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
      </Instruction>

      <Image.PreviewGroup>
        <ul className="d-table">
          {task.data.cards.map((cardId: ImageCardId, index: number) => {
            const bot = BOTS_LIST[index];
            return (
              <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
                <ImageBlurButtonContainer
                  cardId={cardId}
                  className={clsx('d-table__card', user?.data?.value === cardId && 'd-table__card--selected')}
                >
                  <ImageCard
                    key={`table-focus-${cardId}`}
                    imageId={cardId}
                    cardWidth={cardWidth}
                    className="d-table__image-card"
                  />
                </ImageBlurButtonContainer>

                <div className="d-table__player-info">
                  <Avatar id={bot.avatarId} className="d-table__player-avatar" size="default" />
                  <span
                    className="d-table__player-bar"
                    style={{ backgroundColor: AVATARS[bot.avatarId].color }}
                  />
                  <span className="d-table__player-name">
                    {bot.name}, {AVATARS[bot.avatarId].description[language]}
                  </span>
                </div>
                <Space className="space-container">
                  <Button
                    shape="round"
                    type="primary"
                    disabled={user.ready}
                    loading={isLoading}
                    onClick={() =>
                      onSubmitTask({
                        data: { value: cardId },
                      })
                    }
                  >
                    <Translate pt="Esse é o impostor" en="This is the impostor" />
                  </Button>
                </Space>
              </div>
            );
          })}
        </ul>
      </Image.PreviewGroup>
    </>
  );
};