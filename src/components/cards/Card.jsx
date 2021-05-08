import React, { memo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

function Card({ children, header, footer, color, size, className }) {
  const baseClass = 'card';

  return (
    <div className={clsx(baseClass, `${baseClass}--${size}`, className)}>
      <span className={`${baseClass}__header color-background--${color}`}>{header}</span>
      <span className={`${baseClass}__text`}>{children}</span>
      {footer && <span className={`${baseClass}__footer`}>{footer}</span>}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.any.isRequired,
  header: PropTypes.string,
  footer: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
};

Card.defaultProps = {
  header: 'Carta',
  color: 'none',
  size: 'medium',
  className: '',
};

export default memo(Card);
