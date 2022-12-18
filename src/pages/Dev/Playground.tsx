/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// import { Image, Layout } from 'antd';
import GAME_LIST from 'utils/info';
import { Avatar, AvatarEntry } from 'components/avatars';
import { AdminOnlyContainer } from 'components/admin';
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
import { CSSProperties, useMemo } from 'react';
import { ImageCard } from 'components/cards';

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

  const allSuspects = Object.values(suspects);
  const names: string[] = [];
  const namelessSuspects = allSuspects.reduce((acc: any, suspect) => {
    if (suspect.name.pt.includes('XXX') || suspect.name.en.includes('XXX')) {
      acc.push(suspect);
    } else {
      names.push(suspect.name.en);
      names.push(suspect.name.pt);
    }
    return acc;
  }, []);
  const allNames = names.sort();
  return (
    <div>
      <DevHeader title="Playground" />
      {/* <AdminOnlyContainer>Hello</AdminOnlyContainer> */}
      {/* <TimedTimerBar duration={30} onExpire={() => console.log('done')} /> */}
      {/* <TurnOrder players={players} order={Object.keys(players)} activePlayerId={Object.keys(players)[3]} /> */}

      {/* <Space>
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
      </Space> */}
      <ul style={styles}>
        {/* {allNames.map((name: string) => {
          return (
            <li key={name}>
              <Tag>{name}</Tag>
            </li>
          );
        })} */}
      </ul>

      <ul style={styles}>
        {namelessSuspects.map((suspect: any) => {
          return (
            <li key={suspect.id} style={stylesLi}>
              <ImageCard imageId={suspect.id} cardWidth={108} preview={false} />
              <div>{suspect.id}</div>
              {/* <div>{suspect.name.en}</div> */}
              <div>{suspect.name.pt}</div>
              {/* <div>{suspect.gender}</div> */}
            </li>
          );
        })}
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

const suspects = {
  'us-01': {
    id: 'us-01',
    name: {
      pt: 'Artur A.',
      en: 'Arthur A.',
    },
    gender: 'male',
  },
  'us-02': {
    id: 'us-02',
    name: {
      pt: 'Pedro B.',
      en: 'Prince B.',
    },
    gender: 'male',
  },
  'us-03': {
    id: 'us-03',
    name: {
      pt: 'Conrado C.',
      en: 'Cameron C.',
    },
    gender: 'male',
  },
  'us-04': {
    id: 'us-04',
    name: {
      pt: 'Paulo D.',
      en: 'Paul D.',
    },
    gender: 'male',
  },
  'us-05': {
    id: 'us-05',
    name: {
      pt: 'Jéferson E.',
      en: 'Jesse E.',
    },
    gender: 'male',
  },
  'us-06': {
    id: 'us-06',
    name: {
      pt: 'Frederico F.',
      en: 'Fredrick F.',
    },
    gender: 'male',
  },
  'us-07': {
    id: 'us-07',
    name: {
      pt: 'Rogério G.',
      en: 'Roger G.',
    },
    gender: 'male',
  },
  'us-08': {
    id: 'us-08',
    name: {
      pt: 'Raimundo H.',
      en: 'Raymond H.',
    },
    gender: 'male',
  },
  'us-09': {
    id: 'us-09',
    name: {
      pt: 'Janine I.',
      en: 'Janine I.',
    },
    gender: 'female',
  },
  'us-10': {
    id: 'us-10',
    name: {
      pt: 'Levi J.',
      en: 'Levi J.',
    },
    gender: 'male',
  },
  'us-11': {
    id: 'us-11',
    name: {
      pt: 'Nelson K.',
      en: 'Norton K.',
    },
    gender: 'male',
  },
  'us-12': {
    id: 'us-12',
    name: {
      pt: 'Rosana L.',
      en: 'Rosanne L.',
    },
    gender: 'female',
  },
  'us-13': {
    id: 'us-13',
    name: {
      pt: 'Marta M.',
      en: 'Megan M.',
    },
    gender: 'female',
  },
  'us-14': {
    id: 'us-14',
    name: {
      pt: 'Nataniel N.',
      en: 'Nathaniel N.',
    },
    gender: 'male',
  },
  'us-15': {
    id: 'us-15',
    name: {
      pt: 'Júlio O.',
      en: 'John O.',
    },
    gender: 'male',
  },
  'us-16': {
    id: 'us-16',
    name: {
      pt: 'Priscila P.',
      en: 'Prisca P.',
    },
    gender: 'female',
  },
  'us-17': {
    id: 'us-17',
    name: {
      pt: 'Fagner Q.',
      en: 'Flick Q.',
    },
    gender: 'male',
  },
  'us-18': {
    id: 'us-18',
    name: {
      pt: 'Ramon R.',
      en: 'Randall R.',
    },
    gender: 'male',
  },
  'us-19': {
    id: 'us-19',
    name: {
      pt: 'Vicente S.',
      en: 'Vincent S.',
    },
    gender: 'male',
  },
  'us-20': {
    id: 'us-20',
    name: {
      pt: 'Tânia T.',
      en: 'Tonya T.',
    },
    gender: 'female',
  },
  'us-21': {
    id: 'us-21',
    name: {
      pt: 'Úrsula U.',
      en: 'Una U.',
    },
    gender: 'female',
  },
  'us-22': {
    id: 'us-22',
    name: {
      pt: 'Jesilene V.',
      en: 'Jocelyn V.',
    },
    gender: 'female',
  },
  'us-23': {
    id: 'us-23',
    name: {
      pt: 'Benedito W.',
      en: 'Brian W.',
    },
    gender: 'male',
  },
  'us-24': {
    id: 'us-24',
    name: {
      pt: 'Basílio X.',
      en: 'Bassam X.',
    },
    gender: 'male',
  },
  'us-25': {
    id: 'us-25',
    name: {
      pt: 'Madalena Y.',
      en: 'Madeline Y.',
    },
    gender: 'female',
  },
  'us-26': {
    id: 'us-26',
    name: {
      pt: 'Adamastor Z.',
      en: 'Coach Adam Z.',
    },
    gender: 'male',
  },
  'us-27': {
    id: 'us-27',
    name: {
      pt: 'Antônio A.',
      en: 'Anthony A.',
    },
    gender: 'male',
  },
  'us-28': {
    id: 'us-28',
    name: {
      pt: 'Amanda B.',
      en: 'Amanda B.',
    },
    gender: 'female',
  },
  'us-29': {
    id: 'us-29',
    name: {
      pt: 'André C.',
      en: 'Andre C.',
    },
    gender: 'male',
  },
  'us-30': {
    id: 'us-30',
    name: {
      pt: 'Heitor D.',
      en: 'Hector D.',
    },
    gender: 'male',
  },
  'us-31': {
    id: 'us-31',
    name: {
      pt: 'Estefânia E.',
      en: 'Stephanie E.',
    },
    gender: 'female',
  },
  'us-32': {
    id: 'us-32',
    name: {
      pt: 'Valentina F.',
      en: 'Valentina F.',
    },
    gender: 'female',
  },
  'us-33': {
    id: 'us-33',
    name: {
      pt: 'Geraldo G.',
      en: 'Gary G.',
    },
    gender: 'male',
  },
  'us-34': {
    id: 'us-34',
    name: {
      pt: 'Sérgio H.',
      en: 'Sean H.',
    },
    gender: 'male',
  },
  'us-35': {
    id: 'us-35',
    name: {
      pt: 'Roberto I.',
      en: 'Robert I.',
    },
    gender: 'male',
  },
  'us-36': {
    id: 'us-36',
    name: {
      pt: 'Jeremias J.',
      en: 'Jeremiah J.',
    },
    gender: 'male',
  },
  'us-37': {
    id: 'us-37',
    name: {
      pt: 'Josenildo K.',
      en: 'Snoopy K.',
    },
    gender: 'male',
  },
  'us-38': {
    id: 'us-38',
    name: {
      pt: 'Lia L.',
      en: 'Lia L.',
    },
    gender: 'female',
  },
  'us-39': {
    id: 'us-39',
    name: {
      pt: 'Solange M.',
      en: 'Solange M.',
    },
    gender: 'female',
  },
  'us-40': {
    id: 'us-40',
    name: {
      pt: 'Patrícia N.',
      en: 'Patricia N.',
    },
    gender: 'female',
  },
  'us-41': {
    id: 'us-41',
    name: {
      pt: 'Alexandre O.',
      en: 'Alexander O.',
    },
    gender: 'male',
  },
  'us-42': {
    id: 'us-42',
    name: {
      pt: 'Catarina P.',
      en: 'Katherine P.',
    },
    gender: 'female',
  },
  'us-43': {
    id: 'us-43',
    name: {
      pt: 'Felicia Q.',
      en: 'Felicia Q.',
    },
    gender: 'female',
  },
  'us-44': {
    id: 'us-44',
    name: {
      pt: 'Rômulo R.',
      en: 'Roy R.',
    },
    gender: 'male',
  },
  'us-45': {
    id: 'us-45',
    name: {
      pt: 'Marlene S.',
      en: 'Marlene S.',
    },
    gender: 'female',
  },
  'us-46': {
    id: 'us-46',
    name: {
      pt: 'Ricardo T.',
      en: 'Ricardo T.',
    },
    gender: 'male',
  },
  'us-47': {
    id: 'us-47',
    name: {
      pt: 'Bartolomeu U.',
      en: 'Barry U.',
    },
    gender: 'male',
  },
  'us-48': {
    id: 'us-48',
    name: {
      pt: 'Janice V.',
      en: 'Janice V.',
    },
    gender: 'female',
  },
  'us-49': {
    id: 'us-49',
    name: {
      pt: 'Cristina W.',
      en: 'Kristen W.',
    },
    gender: 'female',
  },
  'us-50': {
    id: 'us-50',
    name: {
      pt: 'Bernardo X.',
      en: 'Benjamin X.',
    },
    gender: 'male',
  },
  'us-51': {
    id: 'us-51',
    name: {
      pt: 'Edgar Y.',
      en: 'Edgard Y.',
    },
    gender: 'male',
  },
  'us-52': {
    id: 'us-52',
    name: {
      pt: 'Ernesto Z.',
      en: 'Ernest Z.',
    },
    gender: 'male',
  },
  'us-53': {
    id: 'us-53',
    name: {
      pt: 'Sebastião A.',
      en: 'Sebastian A.',
    },
    gender: 'male',
  },
  'us-54': {
    id: 'us-54',
    name: {
      pt: 'Cristiano B.',
      en: 'Christian B.',
    },
    gender: 'male',
  },
  'us-55': {
    id: 'us-55',
    name: {
      pt: 'Suzana C.',
      en: 'Suzanne C.',
    },
    gender: 'female',
  },
  'us-56': {
    id: 'us-56',
    name: {
      pt: 'Natália D.',
      en: 'Natalie D.',
    },
    gender: 'female',
  },
  'us-57': {
    id: 'us-57',
    name: {
      pt: 'Velma E.',
      en: 'Wilma E.',
    },
    gender: 'female',
  },
  'us-58': {
    id: 'us-58',
    name: {
      pt: 'Francisco F.',
      en: 'Francis F.',
    },
    gender: 'male',
  },
  'us-59': {
    id: 'us-59',
    name: {
      pt: 'Jorge G.',
      en: 'George G.',
    },
    gender: 'male',
  },
  'us-60': {
    id: 'us-60',
    name: {
      pt: 'Jair H.',
      en: 'James H.',
    },
    gender: 'male',
  },
  'us-61': {
    id: 'us-61',
    name: {
      pt: 'Sandoval I.',
      en: 'Samuel I.',
    },
    gender: 'male',
  },
  'us-62': {
    id: 'us-62',
    name: {
      pt: 'Manuel J.',
      en: 'Mateo J.',
    },
    gender: 'male',
  },
  'us-63': {
    id: 'us-63',
    name: {
      pt: 'Luís K.',
      en: 'Louis K.',
    },
    gender: 'male',
  },
  'us-64': {
    id: 'us-64',
    name: {
      pt: 'Sandra L.',
      en: 'Sandra L.',
    },
    gender: 'female',
  },
  'us-65': {
    id: 'us-65',
    name: {
      pt: 'Carlos M.',
      en: 'Carl M.',
    },
    gender: 'male',
  },
  'us-66': {
    id: 'us-66',
    name: {
      pt: 'Bruno N.',
      en: 'Ben N.',
    },
    gender: 'male',
  },
  'us-67': {
    id: 'us-67',
    name: {
      pt: 'Walter O.',
      en: 'Walter O.',
    },
    gender: 'male',
  },
  'us-68': {
    id: 'us-68',
    name: {
      pt: 'Pequi P.',
      en: 'Peter P.',
    },
    gender: 'male',
  },
  'us-69': {
    id: 'us-69',
    name: {
      pt: 'Percival Q.',
      en: 'Percival Q.',
    },
    gender: 'male',
  },
  'us-70': {
    id: 'us-70',
    name: {
      pt: 'Dulce R.',
      en: 'Deborah R.',
    },
    gender: 'female',
  },

  'us-71': {
    id: 'us-71',
    name: {
      pt: 'Gabriel S',
      en: 'Gabriel S',
    },
    gender: 'male',
  },
  'us-72': {
    id: 'us-72',
    name: {
      pt: 'Denílson T',
      en: 'Devon T',
    },
    gender: 'male',
  },
  'us-73': {
    id: 'us-73',
    name: {
      pt: 'Eva U',
      en: 'Eve U',
    },
    gender: 'female',
  },
  'us-74': {
    id: 'us-74',
    name: {
      pt: 'Tarcísio V',
      en: 'Trevor V',
    },
    gender: 'male',
  },
  'us-75': {
    id: 'us-75',
    name: {
      pt: 'Ivone W',
      en: 'Ivone W',
    },
    gender: 'female',
  },
  'us-76': {
    id: 'us-76',
    name: {
      pt: 'Abigail X',
      en: 'Abigail X',
    },
    gender: 'female',
  },
  'us-77': {
    id: 'us-77',
    name: {
      pt: 'Tanaka Y',
      en: 'Tanaka Y',
    },
    gender: 'male',
  },
  'us-78': {
    id: 'us-78',
    name: {
      pt: 'Kyle Z',
      en: 'Caio Z',
    },
    gender: 'male',
  },
  'us-79': {
    id: 'us-79',
    name: {
      pt: 'M A',
      en: 'Mo A',
    },
    gender: 'female',
  },
  'us-80': {
    id: 'us-80',
    name: {
      pt: 'Ana Dayane B',
      en: 'Anisha B',
    },
    gender: 'female',
  },
  'us-81': {
    id: 'us-81',
    name: {
      pt: 'Claudimiro C',
      en: 'Jean Claude C',
    },
    gender: 'male',
  },
  'us-82': {
    id: 'us-82',
    name: {
      pt: 'Murilo D',
      en: 'Mortimer D',
    },
    gender: 'male',
  },
  'us-83': {
    id: 'us-83',
    name: {
      pt: 'Eru E',
      en: 'Eru E',
    },
    gender: 'male',
  },
  'us-84': {
    id: 'us-84',
    name: {
      pt: 'Douglas F',
      en: 'Doug F',
    },
    gender: 'male',
  },
  'us-85': {
    id: 'us-85',
    name: {
      pt: 'Gabriela G',
      en: 'Gabrielle G',
    },
    gender: 'female',
  },
  'us-86': {
    id: 'us-86',
    name: {
      pt: 'Hariko H',
      en: 'Hariko H',
    },
    gender: 'female',
  },
  'us-87': {
    id: 'us-87',
    name: {
      pt: 'Pâmela I',
      en: 'Pamela I',
    },
    gender: 'female',
  },
  'us-88': {
    id: 'us-88',
    name: {
      pt: 'Enzo J',
      en: 'Ethan J',
    },
    gender: 'male',
  },
  'us-89': {
    id: 'us-89',
    name: {
      pt: 'Camila K',
      en: 'Cristal K',
    },
    gender: 'female',
  },
  'us-90': {
    id: 'us-90',
    name: {
      pt: ' L',
      en: 'Kathleen L',
    },
    gender: 'female',
  },
  'us-91': {
    id: 'us-91',
    name: {
      pt: 'Maeda M',
      en: 'Maeda M',
    },
    gender: 'male',
  },
  'us-92': {
    id: 'us-92',
    name: {
      pt: 'Amélia N',
      en: 'Amelia N',
    },
    gender: 'female',
  },
  'us-93': {
    id: 'us-93',
    name: {
      pt: 'Otavino O',
      en: 'Owen O',
    },
    gender: 'male',
  },
  'us-94': {
    id: 'us-94',
    name: {
      pt: 'Marcos P',
      en: 'Mark P',
    },
    gender: 'male',
  },
  'us-95': {
    id: 'us-95',
    name: {
      pt: 'Quércio Q',
      en: 'Quentin Q',
    },
    gender: 'male',
  },
  'us-96': {
    id: 'us-96',
    name: {
      pt: 'Saulo R',
      en: 'Stanley R',
    },
    gender: 'male',
  },
  'us-97': {
    id: 'us-97',
    name: {
      pt: 'Paxton S',
      en: 'Péricles S',
    },
    gender: 'male',
  },
  'us-98': {
    id: 'us-98',
    name: {
      pt: 'Gerson T',
      en: 'Graham T',
    },
    gender: 'male',
  },
  'us-99': {
    id: 'us-99',
    name: {
      pt: 'Valesca U',
      en: 'Vanessa U',
    },
    gender: 'female',
  },
  'us-100': {
    id: 'us-100',
    name: {
      pt: 'Ericlécio V',
      en: 'Easton V',
    },
    gender: 'male',
  },
  'us-101': {
    id: 'us-101',
    name: {
      pt: 'Jaci W',
      en: 'Jaci W',
    },
    gender: 'male',
  },
  'us-102': {
    id: 'us-102',
    name: {
      pt: 'Giovani X',
      en: 'Giovanni X',
    },
    gender: 'male',
  },
  'us-103': {
    id: 'us-103',
    name: {
      pt: 'Fábio Y',
      en: 'Farley Y',
    },
    gender: 'female',
  },
  'us-104': {
    id: 'us-104',
    name: {
      pt: 'Zacarías Z',
      en: 'Zachary Z',
    },
    gender: 'male',
  },
  'us-105': {
    id: 'us-105',
    name: {
      pt: 'Marcia A',
      en: 'Margaret A',
    },
    gender: 'female',
  },
  'us-106': {
    id: 'us-106',
    name: {
      pt: 'Denise B',
      en: 'Denise B',
    },
    gender: 'female',
  },
  'us-107': {
    id: 'us-107',
    name: {
      pt: 'Clóvis C',
      en: 'Charles C',
    },
    gender: 'male',
  },
  'us-108': {
    id: 'us-108',
    name: {
      pt: 'Cleiton D',
      en: 'Clayton D',
    },
    gender: 'male',
  },
  'us-109': {
    id: 'us-109',
    name: {
      pt: 'Shirley E',
      en: 'Shirley E',
    },
    gender: 'female',
  },
  'us-110': {
    id: 'us-110',
    name: {
      pt: 'Nassim F',
      en: 'Nassim F',
    },
    gender: 'male',
  },
  'us-111': {
    id: 'us-111',
    name: {
      pt: 'Monique G',
      en: 'Monique G',
    },
    gender: 'female',
  },
  'us-112': {
    id: 'us-112',
    name: {
      pt: 'Nestor H',
      en: 'Nolan H',
    },
    gender: 'male',
  },
  'us-113': {
    id: 'us-113',
    name: {
      pt: 'Cris I',
      en: 'Chris I',
    },
    gender: 'male',
  },
  'us-114': {
    id: 'us-114',
    name: {
      pt: 'Isaiah J',
      en: 'Isaiah J',
    },
    gender: 'male',
  },
};

console.log({ suspects });

const rawData = [
  {
    text: 'bruxa',
  },
  {
    text: 'Hello Kitty',
  },
  {
    text: 'Robô',
  },
  {
    text: 'Imposto de Renda',
  },
  {
    text: 'Vampiros',
  },
  {
    text: 'esquilos',
  },
  {
    text: 'alienígenas',
  },
  {
    text: 'fogos de artifício',
  },
  {
    text: 'biscoitos',
  },
  {
    text: 'frisbee',
  },
  {
    text: 'dragões',
  },
  {
    text: 'Torre inclinada de Pisa',
  },
  {
    text: 'Shakespeare',
  },
  {
    text: 'Papel',
  },
  {
    text: 'Dia da Mentira',
  },
  {
    text: 'montanha russa',
  },
  {
    text: 'flores',
  },
  {
    text: 'Caiaque',
  },
  {
    text: 'Seu Madruga',
  },
  {
    text: 'Eletricidade',
  },
  {
    text: 'Sushi',
  },
  {
    text: 'Café',
  },
  {
    text: 'edifício Empire State',
  },
  {
    text: 'Dinheiro',
  },
  {
    text: 'Pirâmides de Gizé',
  },
  {
    text: 'Mula sem cabeça',
  },
  {
    text: 'Estátua da Liberdade',
  },
  {
    text: 'Filhotes',
  },
  {
    text: 'Satélites',
  },
  {
    text: 'jacuzzi',
  },
  {
    text: 'Thomas Edison',
  },
  {
    text: 'Atlantis',
  },
  {
    text: 'Napoleão',
  },
  {
    text: 'beringela',
  },
  {
    text: 'rádio',
  },
  {
    text: "Garrafa d'água",
  },
  {
    text: 'fantoches',
  },
  {
    text: 'atendente de telemarketing',
  },
  {
    text: 'fantasma',
  },
  {
    text: 'sol',
  },
  {
    text: 'trolls',
  },
  {
    text: 'Havaí',
  },
  {
    text: 'ioiô',
  },
  {
    text: 'asa delta',
  },
  {
    text: 'girafa',
  },
  {
    text: 'banheiro',
  },
  {
    text: 'nariz de palhaço',
  },
  {
    text: 'alcatraz',
  },
  {
    text: 'Spam',
  },
  {
    text: 'lâmpada elétrica',
  },
  {
    text: 'Thomas Jefferson',
  },
  {
    text: 'rosquinhas',
  },
  {
    text: 'hitler',
  },
  {
    text: 'Abraham Lincoln',
  },
  {
    text: 'pão de ló',
  },
  {
    text: 'bomba atômica',
  },
  {
    text: 'GPS',
  },
  {
    text: 'escova de dente',
  },
  {
    text: 'ostras',
  },
  {
    text: 'gnomos',
  },
  {
    text: 'perucas',
  },
  {
    text: 'beterraba',
  },
  {
    text: 'monociclo',
  },
  {
    text: 'formiga',
  },
  {
    text: 'ar condicionado',
  },
  {
    text: 'cebolinha',
  },
  {
    text: 'pintar',
  },
  {
    text: 'Taj Mahal',
  },
  {
    text: 'Sansão',
  },
  {
    text: 'Grand Canyon',
  },
  {
    text: 'Rick e Morty',
  },
  {
    text: 'Geada',
  },
  {
    text: 'Stonehenge',
  },
  {
    text: 'Bolhas',
  },
  {
    text: 'Gêngis Khan',
  },
  {
    text: 'Coliseu',
  },
  {
    text: 'Sucrilhos',
  },
  {
    text: 'Canjica',
  },
  {
    text: 'Pizza de calabresa',
  },
  {
    text: 'Fones de ouvido',
  },
  {
    text: 'Elfos',
  },
  {
    text: 'George Washington',
  },
  {
    text: 'Calculadora',
  },
  {
    text: 'Submarinos',
  },
  {
    text: 'Fraldas',
  },
  {
    text: 'Antibióticos',
  },
  {
    text: 'Gandhi',
  },
  {
    text: 'Sorvete',
  },
  {
    text: 'Quasimodo',
  },
  {
    text: 'X-burger',
  },
  {
    text: 'Muralha da China',
  },
  {
    text: 'Tropa de Elite',
  },
  {
    text: 'Plástico bolha',
  },
  {
    text: 'Torre Eiffel',
  },
  {
    text: 'Miojo',
  },
  {
    text: 'Sapo-boi',
  },
  {
    text: 'Bigode',
  },
  {
    text: 'Palhaços',
  },
  {
    text: 'Samurai',
  },
  {
    text: 'Buraco negro',
  },
  {
    text: 'Redes sociais',
  },
  {
    text: 'Pandas',
  },
  {
    text: 'Albert Einstein',
  },
  {
    text: 'Foguete',
  },
  {
    text: 'Baiacu',
  },
  {
    text: 'Automóvel',
  },
  {
    text: 'Folha de alumínio',
  },
  {
    text: 'Nikola Tesla',
  },
  {
    text: 'Tamanduá',
  },
  {
    text: 'Coronavírus',
  },
  {
    text: "Joana D'Arc",
  },
  {
    text: 'Pão de forma',
  },
  {
    text: 'Esfinge',
  },
  {
    text: 'Dinossauros',
  },
  {
    text: 'Hamster',
  },
  {
    text: 'Etevaldo',
  },
  {
    text: 'Banana Split',
  },
  {
    text: 'Bilhetinho',
  },
  {
    text: 'Abacate',
  },
  {
    text: 'Milho doce',
  },
  {
    text: 'Plástico bolha',
  },
  {
    text: 'Bicho-preguiça',
  },
  {
    text: 'Lago Ness',
  },
  {
    text: 'A Casa Branca',
  },
  {
    text: 'Repolho',
  },
  {
    text: 'Ponte Golden Gate',
  },
  {
    text: 'Suor',
  },
  {
    text: 'Avião',
  },
  {
    text: 'Baianinho das Casas Bahia',
  },
  {
    text: 'Comida congelada',
  },
];

const parseQuantitativeQuestions = () =>
  rawData.reduce((acc: any, entry, index) => {
    const id = `cm-${index + 1}-pt`;
    const e: any = {
      id,
      text: entry.text,
    };

    // if (entry.scale) {
    //   e.scale = true;
    // }

    acc[id] = e;
    return acc;
  }, {});

const result = parseQuantitativeQuestions();
console.log({ result });
