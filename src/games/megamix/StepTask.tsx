import { Step } from 'components/steps';
import { TaskCruzaPalavras } from './TaskCruzaPalavras';
import { TaskDetetivesImaginativos } from './TaskDetetivesImaginativos';

type StepTaskProps = {
  task: Task;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitTask: GenericFunction;
} & AnnouncementProps;

export const StepTask = ({ task, announcement, ...rest }: StepTaskProps) => {
  let Component = FallbackComponent;
  console.log({ task });

  switch (task.game) {
    case 'cruza-palavras':
      Component = TaskCruzaPalavras;
      break;
    case 'detetives-imaginativos':
      Component = TaskDetetivesImaginativos;
      break;
    default:
      Component = FallbackComponent;
  }

  return (
    <Step fullWidth announcement={announcement}>
      <Component task={task} {...rest} />
    </Step>
  );
};

const FallbackComponent = (_: any) => {
  return <div>Something wrong is not right</div>;
};
