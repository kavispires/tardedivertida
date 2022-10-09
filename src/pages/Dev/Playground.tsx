/* eslint-disable no-unused-vars */

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
