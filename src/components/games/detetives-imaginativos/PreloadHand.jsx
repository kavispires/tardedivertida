import React from 'react';
// Components
import { ImageCardHand as Hand } from '../../cards';

export function PreloadHand({ hand }) {
  return <Hand hand={hand} className="d-preload-hand" />;
}
