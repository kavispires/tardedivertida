// AntDesign Resources
// Hooks
// Utils
import { INSTRUCTIONS } from '../utils/constants';
// Components
import { Title } from 'components/text';
import { useLanguage } from 'hooks/useLanguage';

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
