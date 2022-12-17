interface Task {
  game: string;
  variant?: string;
  condition: string;
  data: Record<string, any>;
}

interface TaskProps {
  task: Task;
  players: GamePlayers;
  user: GamePlayer;
  onSubmitTask: GenericFunction;
}

type SubmitTaskPayload = {
  data: any;
};
