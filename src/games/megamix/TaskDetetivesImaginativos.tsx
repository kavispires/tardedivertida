import { Button, Space } from 'antd';
import { Avatar } from 'components/avatars';
import { ImageBlurButtonContainer, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { AVATARS, BOTS_LIST } from 'utils/avatars';
import { INSTRUCTIONS } from './utils/constants';

export const TaskDetetivesImaginativos = ({ task, onSubmitTask, user }: TaskProps) => {
  const cardWidth = useCardWidth(6, 32, 200, 300);
  const { dualTranslate, language } = useLanguage();
  const { isLoading } = useLoading();

  return (
    <>
      <Title size="small">
        <Title size="small">{dualTranslate(INSTRUCTIONS[task.game])}</Title>
      </Title>
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

      <ul className="container container--center">
        {task.data.cards.map((cardId: ImageCardId, index: number) => {
          const bot = BOTS_LIST[index];
          return (
            <div className="d-table__player-entry" key={`table-focus-${cardId}`}>
              <div className="d-table__cards">
                <ImageBlurButtonContainer cardId={cardId} className="d-table__card">
                  <ImageCard key={`table-focus-${cardId}`} imageId={cardId} cardWidth={cardWidth} />
                </ImageBlurButtonContainer>
              </div>
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
                      data: { cardId },
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
    </>
  );
};
