import React, { memo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// Design Resources
import { Avatar, Tooltip } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { translate } from '../../components/shared';

const GRADES = ['F', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+'];

const DrawingGrade = ({ value }) => {
  const language = useLanguage();
  const grade = GRADES[Math.floor(value / 0.084)];

  const baseClass = 'a-drawing-grade';

  return (
    <Tooltip
      title={translate(
        `Nota baseada em quantos acertos o desenho teve: ${value * 100}%`,
        `Grade based on the number of correct guesses the artwork got: ${value * 100}%`,
        language
      )}
    >
      <Avatar className={clsx(baseClass, `${baseClass}--${grade[0]}`)}>{grade}</Avatar>
    </Tooltip>
  );
};

DrawingGrade.propTypes = {
  value: PropTypes.number.isRequired,
};

export default memo(DrawingGrade);
