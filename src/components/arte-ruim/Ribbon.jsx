import React from 'react';
import { getColorFromLetter } from '../../utils';

function Ribbon({ cardEntryId }) {
  const [, , letter] = cardEntryId.split('-');
  return (
    <div className="ribbon">
      <div
        className={`ribbon__content ribbon__content--${letter} color-background--${getColorFromLetter(
          letter
        )}`}
      >
        {letter}
      </div>
    </div>
  );
}

export default Ribbon;
