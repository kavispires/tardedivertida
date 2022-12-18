import { Title } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';
import { INSTRUCTIONS } from '../utils/constants';

type MinigameTitleProps = {
  round: GameRound;
  task: Task;
};

export function MinigameTitle({ round, task }: MinigameTitleProps) {
  const { dualTranslate } = useLanguage();
  return (
    <Title size="small">
      <span className="minigame-title__number">Minigame {round.current}</span>
      <br />
      {dualTranslate(INSTRUCTIONS[task.game])}
    </Title>
  );
}
