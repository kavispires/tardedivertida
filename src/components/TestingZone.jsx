/* eslint-disable no-unused-vars */
import React from 'react';
// import { Image, Layout } from 'antd';
import gameList from '../resources/games.json';
import { Avatar, AvatarEntry } from './avatars';
import { GameOver, Instruction, PhaseContainer, RoundAnnouncement, Title } from './shared';
// Resources
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { LETTERS } from '../utils/constants';
import Card from './cards/Card';
import { getColorFromLetter } from '../utils';

function TestingZone() {
  const info = gameList['U'];

  const players = {
    Flaviane: {
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
    guesser: 'Kavis',
    playerOrder: ['Flaviane', 'Stephanie', 'Kavis', 'Flaviane', 'Stephanie', 'Kavis'],
    round: 3,
    words: [1, 2, 3, 4, 5],
    // phase: 'GAME_OVER',
    // winner: {
    //   name: 'Flaviane',
    //   avatarId: 15,
    //   score: 35,
    // },
  };

  console.log('==========');
  console.log({ info });
  console.table(players);
  console.log({ state });
  console.log('==========');

  const guesser = players[state.guesser];
  console.log(guesser);

  // return <GameOver info={info} state={state} players={players} />;
  return (
    <PhaseContainer info={info} phase={state.phase} allowedPhase="WORD_SELECTION" className="" fullScreen>
      <div className="u-word-selection"></div>
    </PhaseContainer>
  );
}

export default TestingZone;
