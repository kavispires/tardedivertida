/* eslint-disable no-unused-vars */

// import { Image, Layout } from 'antd';
import gameList from '../resources/games.json';
import { Avatar, AvatarEntry } from '../components/avatars';
import {
  GameOver,
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  RoundAnnouncement,
  Title,
  Icons,
} from '../components';
// Resources
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { LETTERS } from '../utils/constants';
import Card from '../components/cards/Card';
import { getColorFromLetter } from '../utils/helpers';
import * as icons from '../components/icons';

function TestingZone() {
  const info = gameList['U'];

  const players = {
    Flaviane: {
      avatarId: '10',
      name: 'Flaviane',
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    },
    Kavis: {
      avatarId: '11',
      name: 'Kavis',
      ready: false,
      score: 0,
      updatedAt: Date.now(),
    },
    Stephanie: {
      avatarId: '12',
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
    round: {
      current: 1,
      total: 4,
    },
  };
  const onRun = () => console.log('RUN');

  // const questionObj = questions.reduce((acc, question) => {
  //   const id = `m-${question.id}-pt`;
  //   acc[id] = {
  //     ...question,
  //     id,
  //   };
  //   return acc;
  // }, {});
  // console.log({ questionObj });

  const splitQuestions = questions.reduce((acc, question, index) => {
    const id = `m-${index + 1}-en`;

    const [prefix, answers, suffix] = question.suffix.split(/([0-9])+/g);
    // console.log({ prefix, answers, suffix });

    if (!prefix || !answers || !suffix) {
      console.log(question.suffix);
    }
    acc[id] = {
      id,
      prefix: prefix.trim(),
      answers: Number(answers),
      suffix: suffix.trim(),
    };

    return acc;
  }, {});

  console.log({ splitQuestions });

  // return <GameOver info={info} state={state} players={players} />;
  // return (
  //   <PhaseContainer info={info} phase={state.phase} allowedPhase="WORD_SELECTION" className="" fullScreen>
  //     <PhaseAnnouncement title="Drawing!" round={state.round.current} onClose={onRun}>
  //       <Instruction>Do this and that and the other thing</Instruction>
  //     </PhaseAnnouncement>
  //   </PhaseContainer>
  // );
  console.log({ icons });
  console.log(typeof icons, Array.isArray(icons));

  const styles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(15, 1fr)',
    gap: '1rem',
  };
  const stylesLi = {
    border: '1px solid black',
    margin: '1fr',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  return (
    <ul style={styles}>
      {Object.entries(icons).map(([key, Icon], index) => (
        <li key={key} style={stylesLi}>
          <Icon key={index} style={{ width: '100px' }} />
          <div>{key}</div>
        </li>
      ))}
    </ul>
  );
}

export default TestingZone;

const questions = [
  {
    suffix: 'Cite 3 coisas que podem ser encontradas em um bolso',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Cite 3 atrizes excelentes',
    FIELD2: '',
    FIELD3: '',
  },
];