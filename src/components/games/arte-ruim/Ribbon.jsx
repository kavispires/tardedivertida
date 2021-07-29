import PropTypes from 'prop-types';
import React from 'react';
import { getColorFromLetter } from '../../../utils';

function Ribbon({ cardEntryId }) {
  const [, , letter] = cardEntryId.split('::');
  return (
    <div className="a-ribbon">
      <div
        className={`a-ribbon__content a-ribbon__content--${letter} color-background--${getColorFromLetter(
          letter
        )}`}
      >
        {letter}
      </div>
    </div>
  );
}

Ribbon.propTypes = {
  cardEntryId: PropTypes.string,
};

export default Ribbon;
