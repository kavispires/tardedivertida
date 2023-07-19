import clsx from 'clsx';
// AntDesign Resources
import { Button, Image, Space } from 'antd';
// Hooks
import { useBlurCards } from 'hooks/useBlurCards';
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { PUBLIC_URL } from 'utils/constants';
// Components
import { Card, ImageBlurButtonContainer } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './/MinigameTitle';
import { mockSelection } from '../utils/mock';

export const TaskSuperCampeonato = ({ task, round, onSubmitTask, user, players }: TaskProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const cardWidth = useCardWidth(6, { minWidth: 200, maxWidth: 270 });

  // DEV Mock
  useMock(() => {
    onSubmitTask({
      data: { value: mockSelection(task.data.contenders, 'id') },
    });
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={<>É a batalha final, qual desses dois venceria esse desafio?</>}
          en={<>It's the final showdown, which one of these two would win this challenge?</>}
        />
      </Instruction>

      <Space className="space-container">
        <Card header={translate('Desafio', 'Challenge')} color="purple">
          {task.data.challenge.text}
        </Card>
      </Space>

      <Space className="space-container center">
        {task.data.contenders.map((contender: WContender, index: number) => {
          return (
            <Space direction="vertical" key={contender.id}>
              <ImageBlurButtonContainer cardId={contender.id}>
                <ContenderCard
                  size={cardWidth}
                  overlayColor={index === 0 ? 'red' : 'blue'}
                  contender={contender}
                />
              </ImageBlurButtonContainer>
              <Button
                shape="round"
                type="primary"
                disabled={user.ready}
                loading={isLoading}
                onClick={() =>
                  onSubmitTask({
                    data: { value: contender.id },
                  })
                }
              >
                <Translate pt="Selecionar" en="Select" />
              </Button>
            </Space>
          );
        })}
      </Space>
    </>
  );
};

type ContenderCardProps = {
  size: number;
  overlayColor: string;
  contender: WContender | WBracket;
  className?: string;
  hideName?: boolean;
};

export function ContenderCard({ size, overlayColor, contender, className, hideName }: ContenderCardProps) {
  const { language } = useLanguage();
  const { shouldBeBlurred } = useBlurCards();

  const isBlurred = shouldBeBlurred(contender.id);

  const imageURL = contender.id.replace(/-/g, '/');

  return (
    <div className={clsx('w-contender', className)} style={{ width: `${size}px` }}>
      {!hideName && <span className="w-contender-name">{contender.name[language]}</span>}
      <img
        src={`${PUBLIC_URL.IN_GAME}/w-overlay-${overlayColor}.png`}
        className="w-contender-overlay"
        alt="contender"
        style={{ width: `${size}px` }}
      />
      <Image
        src={`${process.env.REACT_APP_TDI_IMAGES_URL}${imageURL}.jpg`}
        width={size}
        className={clsx('w-contender-image', isBlurred && 'w-contender-image--blur')}
        fallback={`${PUBLIC_URL.IN_GAME}/w-no-image.jpg`}
        alt={contender.name[language]}
      />
    </div>
  );
}
