/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// import { Image, Layout } from 'antd';
import GAME_LIST from 'utils/info';
import { Avatar, AvatarEntry } from 'components/avatars';
import { AdminOnlyContainer } from 'components/admin';
// Resources
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import { LETTERS } from 'utils/constants';

import { getColorFromLetter } from 'utils/helpers';
import { DevHeader } from './DevHeader';
import { useTitle } from 'react-use';
import { TimedTimerBar } from 'components/timers';
import { mockPlayers } from 'mock/players';
import { TurnOrder } from 'components/players';
import { TableOrder } from 'components/players/TableOrder';
import { useMemo } from 'react';

function Playground() {
  useTitle('Playground | Dev | Tarde Divertida');
  const info = GAME_LIST['U'];

  const players = useMemo(() => mockPlayers({}, 12, {}), []);

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

  const splitQuestions = questions.reduce((acc: any, question, index) => {
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
    <div>
      <DevHeader title="Playground" />
      <AdminOnlyContainer>Hello</AdminOnlyContainer>
      <TimedTimerBar duration={30} onExpire={() => console.log('done')} />
      <TurnOrder players={players} order={Object.keys(players)} activePlayerId={Object.keys(players)[3]} />

      <Space>
        <TableOrder
          players={players}
          order={Object.keys(players)}
          activePlayerId={Object.keys(players)[3]}
          reorderByUser={Object.keys(players)[3]}
        />

        <TableOrder
          players={players}
          order={Object.keys(players)}
          activePlayerId={Object.keys(players)[3]}
          reorderByUser={Object.keys(players)[3]}
          size="small"
        />
      </Space>
    </div>
  );
}

export default Playground;

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

// const timestamps = [
//   {
//     id: 'ABVY',
//     start: 1652647996458,
//     end: 1652649436331,
//     numPlayers: 6,
//   },
//   {
//     id: 'AOAN',
//     start: 1654460679493,
//     end: 1654461751431,
//     numPlayers: 4,
//   },
//   {
//     id: 'ANPP',
//     start: 1647542016336,
//     end: 1647543929236,
//     numPlayers: 8,
//   },
//   {
//     id: 'AQUM',
//     start: 1656276274168,
//     end: 1656277587137,
//     numPlayers: 6,
//   },
// ];

// const timestamps = [
//   {
//     id: '',
//     start: 0,
//     end: 0,
//     numPlayers: 0,
//   },
//   {
//     id: '',
//     start: 0,
//     end: 0,
//     numPlayers: 0,
//   },
//   {
//     id: '',
//     start: 0,
//     end: 0,
//     numPlayers: 0,
//   },
//   {
//     id: '',
//     start: 0,
//     end: 0,
//     numPlayers: 0,
//   },
// ];

const timestamps = [
  {
    id: 'CGQH',
    start: 1631473289901,
    end: 1631475624884,
    numPlayers: 4,
  },
  {
    id: 'CJLF',
    start: 1644105185680,
    end: 1644108977487,
    numPlayers: 4,
  },
  {
    id: 'CVOV',
    start: 1661714340575,
    end: 1661715735468,
    numPlayers: 6,
  },
  {
    id: '',
    start: 0,
    end: 0,
    numPlayers: 0,
  },
];

const baseTime = 5;

const average = () => {
  const durations = timestamps.map((entry) => {
    const duration = entry.end - entry.start;
    return Math.round(duration / (60 * 1000));
  });

  console.log({ durations });

  const averages = timestamps.map((entry, index) => {
    return Math.round((durations[index] - baseTime) / entry.numPlayers);
  });

  console.log({ averages });
};

average();
