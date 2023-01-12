// AntDesign Resources
import { Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Utils
import { mockSelection } from '../utils/mock';
// Components
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { MinigameTitle } from './MinigameTitle';
import { TransparentButton } from 'components/buttons';

export const TaskPalhetaDeCores = ({ task, round, onSubmitTask, user }: TaskProps) => {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();

  const onSelect = (color: string) => {
    onSubmitTask({
      data: { value: color },
    });
  };

  // // DEV Mock
  useMock(() => {
    onSelect(mockSelection(task.data.palette));
  });

  return (
    <>
      <MinigameTitle round={round} task={task} />
      <Instruction contained>
        <Translate
          pt={<>Selecione a cor que melhor representa o personagem abaixo!</>}
          en={<>Select the color that best represents the character below!</>}
        />
      </Instruction>

      <Card header={translate('Dica', 'Clue')} color="red">
        {task.data.card.text}
      </Card>

      <Space className="space-container k-palette" wrap>
        {task.data.palette.map((color: string) => {
          return (
            <TransparentButton
              onClick={() => onSelect(color)}
              className="k-swatch-button"
              disabled={user.read || isLoading}
            >
              <SplatterSVG color={color} />
            </TransparentButton>
          );
        })}
      </Space>
    </>
  );
};

type SplatterSVGProps = {
  color: string;
} & React.SVGProps<SVGSVGElement>;

export function SplatterSVG({ color, ...rest }: SplatterSVGProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 494.11 511.04" {...rest}>
      <path
        fill={color}
        d="M228.54 0h35.93a4.71 4.71 0 001.3.7c27.26 5 48.92 19.17 65.61 41 13.89 18.12 23 38.05 20.86 61.68-.63 6.91-2.09 13.82-2 20.71.12 7.66 6.12 12.85 13.67 11.74a42 42 0 0014.62-5.55c17.16-10 35.31-15.24 55.25-12.26 27.14 4 51.12 26.19 58 53.26 7.35 29-3 59.73-25.55 76.79-14.57 11-31.25 14.29-49 15.54-14.61 1-24.33 10.1-29.58 23.39-5.11 12.92-2.78 24.76 7.31 34.73 4.49 4.44 9 8.85 13.5 13.3 17.49 17.35 28.24 38.14 30.44 62.73 2.4 26.77-5.22 50.77-21.48 72.23-44 58-133.58 54-171.09-8.39-9.08-15.11-15-32.1-22.78-48-3.63-7.38-7.36-15.08-12.73-21.14-12.88-14.54-34-16.34-53.09-6-12.18 6.57-20.6 17.13-29.76 27A73.21 73.21 0 014.9 387.52C2.41 380.4 1.59 372.7 0 365.28v-4c.34-2.26.82-4.52 1-6.8 2.2-27.35 22.3-52.14 48.79-59.39 10.7-2.92 21.71-4.67 32.5-7.28 16.67-4 28.74-17 30.45-32.32 1.95-17.45-6.31-33.26-21.72-41.45-4.4-2.33-8.91-4.44-13.31-6.77-19.58-10.38-28-26.24-24.72-46.46 3.2-19.73 19-33.44 38.86-34.2 10.44-.39 19.85 3.32 29.55 6.12 14.11 4.07 25-.16 22.21-19.54a84 84 0 011-31.1c10.26-42.42 36.89-69.48 79.33-80.57 1.56-.44 3.12-1 4.6-1.52z"
      ></path>
    </svg>
  );
}
