/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// import { Image, Layout } from 'antd';
import GAME_LIST from 'utils/info';
import { Avatar, AvatarEntry } from 'components/avatars';
// Resources
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Image, Input, Space, Tag } from 'antd';
import { LETTERS } from 'utils/constants';

import { getColorFromLetter } from 'utils/helpers';
import { DevHeader } from './DevHeader';
import { useTitle } from 'react-use';
import { TimedTimerBar } from 'components/timers';
import { mockPlayers } from 'mock/players';
import { TurnOrder } from 'components/players';
import { TableOrder } from 'components/players/TableOrder';
import { CSSProperties, useMemo, useState } from 'react';
import { ImageCard } from 'components/cards';
import { GlyphCard } from 'components/cards/GlyphCard';
import { DrawingCanvas } from 'components/canvas';

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

  const styles: CSSProperties = {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(5, 1fr)',

    // gap: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
  };
  const stylesLi: CSSProperties = {
    border: '1px solid black',
    margin: '4px',
    padding: '8px',
    // width: '132px',
    // display: 'flex',
    // flexDirection: 'column',
    background: 'white',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  };

  const [lines, setLines] = useState<any>([]);

  return (
    <div>
      <DevHeader title="Playground" />

      <Space wrap className="gallery">
        <DrawingCanvas lines={lines} setLines={setLines} showControls strokeWidth="large" width={100} />
        <Button onClick={() => console.log(JSON.stringify(lines))}>Log</Button>
      </Space>

      {/* <AdminOnlyContainer>Hello</AdminOnlyContainer> */}
      {/* <TimedTimerBar duration={30} onExpire={() => console.log('done')} /> */}
      {/* <TurnOrder players={players} order={Object.keys(players)} activePlayerId={Object.keys(players)[3]} /> */}

      <Space wrap>
        {/*
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


      */}
      </Space>
      <ul style={styles}>
        {/* {allNames.map((name: string) => {
          return (
            <li key={name}>
              <Tag>{name}</Tag>
            </li>
          );
        })} */}
      </ul>
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

// function moreUS() {
//   return new Array(114).fill(1).reduce((acc, e, i) => {
//     const num: string = e + i < 10 ? `0${e + i}` : e + i;
//     const id = `us-${num}`;
//     const initial = LETTERS[i % LETTERS.length];

//     acc[id] = {
//       id: id,
//       name: {
//         pt: `XXX ${initial}`,
//         en: `XXX ${initial}`,
//       },
//       gender: 'female',
//     };
//     return acc;
//   }, {});
// }

// console.log(allUS)
const rawData: any[] = [];

const parseQuantitativeQuestions = () =>
  rawData.reduce((acc: any, entry, index) => {
    const id = `mr-${index + 1}-pt`;
    const e: any = {
      id,
      text: entry.text,
      type: entry.type,
    };

    acc[id] = e;
    return acc;
  }, {});

const result = parseQuantitativeQuestions();
console.log({ result });

const svg = ``;

const ignoreIds: number[] = [];

function generateSvgDefs(n: number, prefix: string): string {
  let symbols = '';
  for (let i = 1; i <= n; i++) {
    let id = `${prefix}-${i}`;
    symbols += `
      <symbol id="${id}">
        <title>aaa</title>
      </symbol>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${symbols}
      </defs>
    </svg>
  `;
}

export type SignKey = string;
type AlienItem = {
  id: string;
  name: string;
  attributes: Record<string, -5 | -3 | -1 | 0 | 1 | 3 | 5>;
};

const sample: AlienItem = {
  name: 'ioga mat',
  id: '1',
  attributes: {
    heavy: -3,
    old: -3,
    big: -1,
    weapon: -3,
    beautiful: -1,
    plant: -3,
    sound: -1,
    liquid: -5,
    long: 5,
    human: -1,
    valuable: -3,
    power: 1,
    machine: -3,
    tool: 1,
    defense: 1,
    flight: 1,
    sharp: -3,
    bright: -3,
    knowledge: 3,
    odor: 1,
    solid: 1,
    clothes: -1,
    alive: -5,
    warm: -1,
    fast: -3,
    metal: -5,
    danger: -1,
    round: 1,
    food: -5,
    flat: 5,
  },
};

function sortItemAttributesBySpecificWeight(item: AlienItem, knownSigns: SignKey[]) {
  const order = [5, 3, -5, -3, 1, -1];
  const keys = Object.keys(item.attributes);

  // Sort the keys by their values according to the order
  keys.sort((a, b) => {
    const valueA = item.attributes[a];
    const valueB = item.attributes[b];

    const indexA = order.indexOf(valueA);
    const indexB = order.indexOf(valueB);

    return indexA - indexB;
  });
  // Only include known signs and ignore -1 values
  return keys
    .filter((attribute) => knownSigns.includes(attribute) && item.attributes[attribute] !== -1)
    .map((attr) => {
      const weight = item.attributes[attr];
      if (weight && weight < 0) {
        return `!${attr}`;
      } else {
        return attr;
      }
    })
    .slice(0, 5);
}

console.log(sortItemAttributesBySpecificWeight(sample, Object.keys(sample.attributes)));
