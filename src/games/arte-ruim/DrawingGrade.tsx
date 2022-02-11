import clsx from 'clsx';
// Design Resources
import { Avatar, Tooltip } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';

const GRADES = ['F', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];

type DrawingGradeProps = {
  value: number;
};

export const DrawingGrade = ({ value }: DrawingGradeProps) => {
  const { translate } = useLanguage();
  const grade = GRADES[Math.floor(value / 0.084)];

  const baseClass = 'a-drawing-grade';

  return (
    <Tooltip
      title={translate(
        `Nota baseada em quantos acertos o desenho teve: ${value * 100}%`,
        `Grade based on the number of correct guesses the artwork got: ${value * 100}%`
      )}
    >
      <Avatar className={clsx(baseClass, `${baseClass}--${grade[0]}`)}>{grade}</Avatar>
    </Tooltip>
  );
};
