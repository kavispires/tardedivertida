import { useLanguage } from 'hooks/useLanguage';
import { TITLES } from '../utils/constants';

type TaskTitleProps = {
  task: Task;
};

export const TaskTitle = ({ task }: TaskTitleProps) => {
  const { dualTranslate } = useLanguage();

  const instruction: DualLanguageValue = TITLES?.[task.game] ?? {
    pt: 'Nome do Jogo',
    en: 'Game Title',
  };

  return <>{dualTranslate(instruction)}</>;
};
