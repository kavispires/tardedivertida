import React from 'react';

function Ribbon({ cardEntryId }) {
  const [, , letter] = cardEntryId.split('-');
  return (
    <div className="ribbon">
      <div className={`ribbon__content ribbon__content--${letter} color-background--${letter}`}>{letter}</div>
    </div>
  );
}

export default Ribbon;
