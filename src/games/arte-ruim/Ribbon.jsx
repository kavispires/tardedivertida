import PropTypes from 'prop-types';
import React from 'react';
// Utils
import { getColorFromLetter } from '../../utils';
import { SEPARATOR } from '../../utils/constants';

function Ribbon({ cardEntryId }) {
  const [, , letter] = cardEntryId.split(SEPARATOR);
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
