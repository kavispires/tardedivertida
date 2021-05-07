import React from 'react';
// import { Image, Layout } from 'antd';
import gameList from '../resources/games.json';
import Avatar from './avatars/Avatar';
import AvatarEntry from './avatars/AvatarEntry';
import GameOver from './shared/GameOver';
import Instruction from './shared/Instruction';
import PhaseContainer from './shared/PhaseContainer';
import RoundAnnouncement from './shared/RoundAnnouncement';
// Resources
import allWords from '../resources/um-so-words.json';
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import Title from './shared/Title';

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
    <PhaseContainer
      info={info}
      phase={state.phase}
      allowedPhase="WORD_SELECTION"
      className="u-word-selection-phase"
    >
      <div className="u-word-selection">
        <Title white>Selecione a Palavra-Secreta</Title>

        <Instruction white>
          A palavra secreta com mais votos será escolhida para essa rodada. Você pode selecionar quantas
          quiser!
        </Instruction>

        <ul className="u-word-card">
          {state.words.map((word) => {
            return (
              <li className="u-word-card__word">
                <button className="u-word-card__button">
                  <span className="u-word-card__text">{allWords[word]}</span>
                  <span className="u-word-card__icon">
                    <CheckCircleFilled />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <Button type="primary">Enviar votos</Button>
      </div>
    </PhaseContainer>
  );
}

export default TestingZone;
