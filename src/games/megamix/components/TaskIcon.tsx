import { LoupeIcon } from 'components/icons/LoupeIcon';
import { TDIcon } from 'components/icons/TDIcon';

type TaskIconProps = {
  task: Task;
};

export const TaskIcon = ({ task }: TaskIconProps) => {
  switch (task.game) {
    case 'cruza-palavras':
      return <TDIcon />;
    case 'detetives-imaginativos':
      return <LoupeIcon />;
    default:
      return <TDIcon />;
  }
};
