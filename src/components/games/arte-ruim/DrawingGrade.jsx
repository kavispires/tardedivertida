import React, { memo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
const minValues = [97, 93, 90, 87, 83, 80, 77, 73, 70, 67, 65, 0];

const DrawingGrade = ({ value }) => {
  const grade = grades[minValues.findIndex((i) => value * 100 >= i) ?? 11];

  const baseClass = 'a-drawing-grade';

  return <Avatar className={clsx(baseClass, `${baseClass}--${grade[0]}`)}>{grade}</Avatar>;
};

DrawingGrade.propTypes = {
  value: PropTypes.number.isRequired,
};

export default memo(DrawingGrade);
