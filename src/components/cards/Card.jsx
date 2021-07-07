import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { getColorFromLetter } from '../../utils';

export const Card = memo(function ({
  children,
  header,
  footer,
  color,
  size,
  randomColor,
  className,
  headerClassName,
  footerClassName,
}) {
  const baseClass = 'card';

  const bgColor = randomColor ? getColorFromLetter(typeof children === 'string' ? children[0] : 'X') : color;

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <span className={clsx(`${baseClass}__header`, `color-background--${bgColor}`, headerClassName)}>
        {header}
      </span>
      <span className={`${baseClass}__text`}>{children}</span>
      {footer && <span className={clsx(`${baseClass}__footer`, footerClassName)}>{footer}</span>}
    </div>
  );
});

Card.propTypes = {
  children: PropTypes.any.isRequired,
  header: PropTypes.string,
  footer: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  randomColor: PropTypes.bool,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  footerClassName: PropTypes.string,
};

Card.defaultProps = {
  header: 'Carta',
  color: 'none',
  size: 'medium',
  randomColor: false,
  className: '',
  headerClassName: '',
  footerClassName: '',
};

export default memo(Card);
