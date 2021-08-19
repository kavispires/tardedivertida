import React from 'react';
// Components
import { ImageCardHand as Hand } from '../../components/cards';

export function PreloadHand({ hand }) {
  return <Hand hand={hand} className="d-preload-hand" />;
}
