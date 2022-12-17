import { useLanguage } from 'hooks/useLanguage';
import { useSpeak } from 'hooks/useSpeak';
import { INSTRUCTIONS } from '../utils/constants';

type TaskInstructionsProps = {
  task: Task;
};

export const TaskInstructions = ({ task }: TaskInstructionsProps) => {
  const { dualTranslate } = useLanguage();

  const instruction: DualLanguageValue = INSTRUCTIONS?.[task.game] ?? {
    pt: 'Se vire nos 30!',
    en: 'Do something!',
  };

  useSpeak(instruction);

  return <>{dualTranslate(instruction)}</>;
};
