import { Translate } from 'components/language';

type TaskInstructionsProps = {
  task: Task;
};

export const TaskTitle = ({ task }: TaskInstructionsProps) => {
  switch (task.game) {
    case 'cruza-palavras':
      return <Translate pt="Cruza Palavras" en="Mixed Clues" />;
    case 'detetives-imaginativos':
      return <Translate pt="Detetives Imaginativos" en="Imaginative Detectives" />;

    default:
      return <Translate pt="Nome do Jogo" en="Game Title" />;
  }
};
