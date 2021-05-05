import React from 'react';
// import { Image, Layout } from 'antd';
import gameList from '../resources/games.json';
import PhaseContainer from './shared/PhaseContainer';
import RoundAnnouncement from './shared/RoundAnnouncement';

function TestingZone() {
  const info = gameList['U'];

  const players = {
    Flaviave: {
      avatarId: 10,
      name: 'Flaviane',
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    },
    Kavis: {
      avatarId: 11,
      name: 'Kavis',
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    },
    Stephanie: {
      avatarId: 12,
      name: 'Stephanie',
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    },
  };

  // Mock State
  const state = {
    phase: 'WORD_SELECTION',
    round: 1,
    words: [1, 2, 3, 4, 5],
  };

  return (
    <PhaseContainer info={info} phase={state.phase} allowedPhase="WORD_SELECTION" className="testing-zone">
      <RoundAnnouncement
        round={state.round}
        instructions={Array(10).fill('do this and that and that more and whatever, ').join(' ')}
        onPressButton={() => console.log('A')}
        buttonText="Click me"
      />
    </PhaseContainer>
  );
}

export default TestingZone;
