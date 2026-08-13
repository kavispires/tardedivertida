import clsx from 'clsx';
// Ant Design Resources
import { Avatar, Tooltip } from 'antd';
// Components
import { TranslateTemplate } from '@components/language/TranslateTemplate';

const GRADES = ['F', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];

type DrawingGradeProps = {
  value: number;
};

export const DrawingGrade = ({ value }: DrawingGradeProps) => {
  const grade = GRADES[Math.floor(value / 0.084)];

  const baseClass = 'a-drawing-grade';

  return (
    <Tooltip
      title={
        <TranslateTemplate
          en="Grade based on the number of correct guesses the artwork got: {value}%"
          pt="Nota baseada em quantos acertos o desenho teve: {value}%"
          values={{ value: value * 100 }}
        />
      }
    >
      <Avatar className={clsx(baseClass, `${baseClass}--${grade[0]}`)}>{grade}</Avatar>
    </Tooltip>
  );
};
