/* eslint-disable no-unused-vars */
import React from 'react';
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
} from '../components/shared';
// Resources
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { LETTERS } from '../utils/constants';
import Card from '../components/cards/Card';
import { getColorFromLetter } from '../utils';

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
  return (
    <PhaseContainer info={info} phase={state.phase} allowedPhase="WORD_SELECTION" className="" fullScreen>
      <PhaseAnnouncement title="Drawing!" round={state.round.current} onClose={onRun}>
        <Instruction>Do this and that and the other thing</Instruction>
      </PhaseAnnouncement>
    </PhaseContainer>
  );
}

export default TestingZone;

const questions = [
  {
    suffix: 'What are 3 things found in a pocket?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 excellent actresses?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Zodiac signs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 award shows?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? Instead of a wedding cake',
    FIELD2: ' they had ___ for dessert at their wedding.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that are unpredictable?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 men\'s names beginning with "H"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 grey things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things there are 7 of?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 jobs you don't want if you have a great sense of smell?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 2 ways to fill the blank? ___belt',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 unusual things people eat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animal sounds you might hear on a farm?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would not enjoy being a police officer?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of night?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 alarms people ignore?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best teachers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of New York?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 2 Asian languages?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? There was no knife',
    FIELD2: ' so William used ___ to spread the butter.',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that might happen to your luggage while traveling?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 stars?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? full___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people use to protect themselves from the rain?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that begin with the letter "I"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you might find in a toolbox?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you do when you are hot?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 foods that come on a stick?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? blind___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that rhyme with feel?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 European languages?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that might break a window?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things with wires?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 of the most intelligent dog breeds?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways to fill in the blank? ___bed',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways someone might cheat on a test?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that might headbutt you?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___pool',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 comedians with TV shows?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 great things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you might put on ice cream?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you flip?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things in a desert?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things there are 10 of?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you find in a pencil case besides pencils?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 sports you would rather watch than play?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Follow the ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people use to attract birds?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 reasons to have a party?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways to fill in the blank? Mr. ___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways a movie director might use?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 big black things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of snow?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that snap?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 small yellow things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? easy___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that rhyme with "win"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 small white things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most likely to enjoy watching a cop show?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you see a lot of in Florida?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things a cowboy might carry?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 southernmost U.S. states?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 types of mustard?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things from the Medieval period?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 excellent male actors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "D"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 movies with a direction in the title?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? ___score',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 kings?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 purple things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 males singles?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you might earn a trophy for?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 red flowers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 cities that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you might find on a playground?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 old-fashioned weapons?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? monkey___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals you might feed at a petting zoo?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most likely to enjoy watching a sitcom?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you see a lot of in New York?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 smelly foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Eli was an engineering professor in his country',
    FIELD2: ' here',
    FIELD3: ' he ___.',
  },
  {
    suffix: 'What are 3 sports good for older people?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people do in a booth?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 kinds of cakes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Chinese foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___off',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 venomous things besides snakes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 foods you can eat hot or cold?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you might need to work in the garden?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things you don't turn off?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 balls you would be surprised to see a golfer tee off with?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 2 ways to fill in the blank? ___plug',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 foods you need a napkin to eat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best police officers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Korea?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 musical instruments known for being noisy?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best lumberjacks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Ireland?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 foods that are noisy to eat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would you most like to speak at your funeral?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Scotland?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places with a waiting list?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix:
      'What are 4 ways to fill in the blank? Everyone was surprised to learn that a book about___ became a bestseller.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 herbs/spices?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that begin with the letter "V"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 Disney heroes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 wild animals you would like to have as a tamed pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things dragons might have in their hoard?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 ways to fill in the blank? There's more than one way to ___ a cat.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things that might hurt farmer's crop?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 loud musical instruments that don't require electricity?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 condiments?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? ___diamond',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 movies with planes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best editors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of cooking?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals with big ears?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___trap',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 words people use for something they can't remember the name of?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that begin with the letter "M"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 domestic pets?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you need ID for?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 car brands that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Shawna went to medical school',
    FIELD2: ' but she works as a ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that get tangled?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 reasons someone might smell bad?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'what are 4 animals with 4-letter names?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you might find in a pool?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things in potato salad besides potato?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix:
      'What are 3 ways to fill in the blank? Jenny finished her presentation and then saw herself in the mirror. She had ___!',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that burn?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 big white things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 female celebrities?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 types of tea?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 movies with the word 'time' in the title?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best interior designers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of dogs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 movies with talking animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best engineers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of dinner?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 men\'s names beginning with "M"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 insects?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? I hired a clown to come to the birthday party',
    FIELD2: ' but they ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 German words everyone knows?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___bottle.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 best amusement park rides?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 major retail chains?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 5 common women's names?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 war films?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that begin with "THR"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? ___box',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways people break into a house?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries with lots of temples?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 Olympic events?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things in a cave?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries with terrible cuisine?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 reasons someone might send a congratulatory card?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 names that can be used either for men or women?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 musical instruments never found in a marching band?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best reporters?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of love?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 movies featuring a high school?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? spleep___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "I"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are hardest to shop for?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? The aliens took Joe and returned him after ___ him.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that if broken',
    FIELD2: " can't be fixed?",
    FIELD3: '',
  },
  {
    suffix: 'What are 5 forgettable US states?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Snow White?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that shrink?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 places where you might wait for a long line?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? ___card',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that end in a "Z"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What is 1 Pokemon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 finger foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 words that begin with "Y"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 candies with nuts in them?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room were youngest at the time of their first kiss?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 European cities that would make a good name for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What is 1 drink?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 mammals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 forgettable planets?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries with lots of rich people?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 popular Halloween costumes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 movies with singing in them?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? When Abby turned on the radio',
    FIELD2: ' she was horrified to learn that a ___ had escaped from the zoo.',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 fun sports to play?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "K"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 difficult things to juggle?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of the Internet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things to be careful of when swimming in the ocean?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 items of clothing you wear in winter?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? money___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come to mind when you think of evening?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 musical instruments that require both hands to play?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 red things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 foods that are high in fiber?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are least likely to participate in a singing competition?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 scary things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 fruits that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 means of communication?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 flowers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 vegetables that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 jobs that require a suit?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 2 ways to fill in the blank? ___bag',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways police might identify a criminal?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 4 least popular types of cookies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? The wedding dress was ruined; it was covered in ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "J"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 5 letters that are used the least?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things made with oats?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 little mammals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries that begin with the letter "A"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 rooms in the house?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 foods you might feed a baby?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries that begin with the letter "P"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things packaged in glass?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 great cities to visit?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries known for ancient ruins?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? fire___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people slice?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries that the U.S. imports a lot of things from?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things other than ears that people have pierced?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 fruits?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 dangerous hobbies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 reasons a package might not make it to its destination?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 musicals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 musical instruments that sound soothing?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? King___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that can be broken?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 Halloween decorations?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people cheat on?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 hot drinks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 poisonous things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What 2 people in the room would least enjoy being teachers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of books?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries that begin with the letter "B"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? tree___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 worst presidents?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries with lots of churches?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people clip?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 jobs people might have at  a hospital?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 icons on a computer?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most likely to run a marathon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you throw out?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 musical instruments that you can play with one hand?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 4 ways to fill in the blank? You wouldn't expect a ___ to do that kind of damage.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "L"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4  icons on a computer?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most  likely to run a marathon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you throw out?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? last___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that can be found in a police car?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things in the sky?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 parts of a car?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 live action Disney films?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 current movie starts with great smiles?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 plants that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 movie monsters?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 jobs that require you to be sneaky?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? upper___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 dangerous mammals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 dangerous sports?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things found in a kindergarten?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are the biggest sports fans?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 names beginning with "Z"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 plants?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 movies based on books?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 musical instruments you need good lungs for?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix:
      'What are 3 ways to fill in the blank? Wanda the Great yanked away the tablecloth and ___ fell on the ground.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 drinks that have bubbles?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 popular board games besides Monopoly?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best leaders in a zombie apocalypse?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Hawaii?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 government jobs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 reasons a baby might be upset?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 musical instruments that. make you smile?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 marine mammals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Waiter! This soup has ___ in it.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "O"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 difficult sports?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room give the best restaurant recommendations?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you might find in the cluttered office?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 names from Star Wars that would be good names for pets?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 paper things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are the biggest animal lovers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 mythical monsters?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? water___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 endangered animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 very long movies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "B"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things in a swamp?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 French woman's name?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "J"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things people waste?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places you might see a log of joggers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? watch___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 electronic things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 fruits you don't just buy one of?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would you most like as parents?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Paris?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 candies that would be good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 types of music?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that you run on a schedule?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 countries that begin with the letter "S"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Life is ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that can be poisonous other than animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 holiday symbols?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "V"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of France?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 4 large animals you'd like to have a hamster-sized version of?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best professional chefs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Los Angeles?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 desserts?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 4 ways to fill in the blank? We didn't expect to see ___ at the rock concert.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 famous landmarks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 jobs that require a uniform?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have eaten the most pie?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of Russia?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that begin with the letter "J"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? cold ___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things many people are allergic to?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 coffee-based drinks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? We ___ all night.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 expensive things middle class people might purchase?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 nicknames for "Elizabeth"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 4 painters?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s name beginning with "B"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 household items that might scare a pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are the biggest daredevils?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you would find at a baseball game?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 famous conspiracy theories?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? At the end of the book it didn\'t say "The End". Instead ',
    FIELD2: ' it said ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that end in "OO"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 game shows?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 small things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 overrated films?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 glass things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of the movies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things to do on snowy days?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 French foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___egg',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 3 most popular sports in Japan?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places that characters might go in a fairy tale?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 U.S. cities?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that shift?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 muffin flavors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you need to go fishing?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you look through?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 French men's names?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 5 ways to fill in the blank? We saw Peg's car after the wreck. It looked like a ___.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 creepy places?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 books with dragons in them?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways to fill in the blank? ___man',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places you might find lint?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 national parks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would least like to be a boss?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things with wheels?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Mexican foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___hook',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 3 ugliest animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 foods served for brunch?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you might find in a fairy tale?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you do when you are cold?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What 3 instruments sound the best?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___table',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are the 5 best presidents?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 sodas that would make good names for a pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most likely to have a secret identity?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you should clean very well?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things Barbie has that you want?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things in the night sky?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 foods only 3 letters long?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things babies shouldn't eat?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? tooth___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that might make you sick?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 magazines with celebrities in them?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "E"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things found in a dungeon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 holidays celebrated with TV shows?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? The zombie made me laugh; it was wearing a ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that might damage a tree?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 diseases that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways to fill in the blank? corn___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words a bus driver might use?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 bright things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "I"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things people save?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 men\'s names beginning with "K"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 household pests?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? holy___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things kids like to jump on?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things found in a sewer?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things a doctor might use to treat you?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 sports with crazy fans?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? fish___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that burn out?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things George Washington might have wanted to be buried with?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 extremely popular actresses?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 U.S. cities you would least like to visit?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that would.  be scary to come across while hiking?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 U.S. states?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that scare off birds?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 carnival games?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would do best in an Ultimate Fighting Championship fight?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that contain "Q"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 safe things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 ways to fill in the blank? Did you see that? He wasn't wearing any ___.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things people do to get on their parent's good sides?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 movies with robots?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___star',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 of the 7 dwarves?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 expressions for "go away"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? As the sun set',
    FIELD2: ' the ___ came out.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that end in "KLE"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 synonyms for "happy"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Japanese words everyone knows?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways to cook chicken?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 big red things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? house___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that would be scary to come across while hiking?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things cats have that people don't?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What is the 1 best color dress?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s names beginning with "E"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 non-sequel movies with a number in the title?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in room are most likely to have fantasized about being a world-famous thief?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things you shouldn't eat while on a diet?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 fruits with a lot of seeds?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___storm',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 people too turn to for advice?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 good names for a dog?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 animals that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that utilize steam?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 good names for a goldfish?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things there are 8 of?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you open?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 names from Star Wars that would be good for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that can damage your computer?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 jobs that require you to wear gloves?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have memorized the most digits of pi?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of the 1920s?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 good toys for a kid who likes to build things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 cool jobs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 types of knives?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 nouns that start with "J"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 5 northernmost U.S. states?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 fruits with a pit?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? egg__',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 5 unusual women's names?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 small musical instruments?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would you most like to take on a two-week camping trip?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to avoid getting hit by lightning?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 great places to visit?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things in the ocean?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What is the 1 best meal of the day?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 plastic things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___mat',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 3 historical figures would you most like to punch?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places you might find a fire alarm?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 4 best colors of hair?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 dangerous things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cereals that sound like they might be diseases?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "D"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things in a casino?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 newspapers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? light___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come in 12?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 great things about living in a city?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have the best poker faces?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that go around a neck?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 game pieces?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? When Mara climbed the mountain',
    FIELD2: ' she was surprised to see a ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that buzz?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cereals that would make good names for a pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ugly things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 supervillains?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 holidays for which people wear special colors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room had the best time at promo?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of Goldilocks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 fuzzy things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? When I heard strange noises outside',
    FIELD2: ' I called ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things people wear when dressing formally?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cereals that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room tell the most interesting stories?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Alaska?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 jobs that require a hat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have dated the most people?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of lunch?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that begin with "GN"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room will go to sleep latest tonight?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 European cities?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 bad movie directors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? When we got on the plane',
    FIELD2: ' we realized we had forgotten ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that can be personalized?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "STR"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have the best singing voices?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that taste bad?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Pixar movies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have the best vocabularies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that you might find in a basement?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 German names?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? low___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come in nuggets?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cities with lots of rich people?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things with pockets?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you can find on a scavenger hunt?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 elements that would make good names for a pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of werewolves?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things with holes in them?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 nicknames for "Susan"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix:
      'What are 3 ways to fill in the blank? The seven dwarves come home to find the Snow White had ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that might be stamped ono a package?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 harsh spoken accents?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you put on toast?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you might cut out of your morning routine if you woke up late?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 healthy foods that taste bad?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 countries that would make a good name for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you need a license to do?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 gold things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 ways to fill in the blank? We're going on vacation to ___.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that are hard to shop for online?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 classic toys?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you might see at a circus?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you drink from?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 occupations that require you to lie?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most likely to run for public office?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you use to clean the bathroom?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 good books?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? white___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come in pairs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 silver things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? The detective notice ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places with lots of mirrors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 2 herbivores?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "R"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of an elephant?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 good names for a cat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? We decided not to get a dog or cat; instead',
    FIELD2: ' we got a ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 films featuring a car?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 overplayed songs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 Asian countries?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 trees?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 overused phrases?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 big fish?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of bread?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 nicknames you might use to refer to your father?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Wow',
    FIELD2: ' this is slow. I should have taken a plane instead of a ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of a used car salesman?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 instruments you would not want to hear a beginner play?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 big mammals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of hot drink?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 brands of clothing?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that might wake you up other than your alarm?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 good names for a rabbit?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix:
      "What are 3 ways to fill in the blank? Madison didn't like gaming in LAs Vegas. Her favorite thing was ___.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come to mind when you think of 3 AM?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 candies that would make good names for a pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 types of berries?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that rise?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 of the best ways to spend time?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have best fashion sense?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of lawyers?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 good picnic foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? You think you have it tough? When I was a kid',
    FIELD2: ' ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of air travel?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Japanese foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room had the highest GPAs in school?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of London?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 jobs a person with high IQ might have?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 sports where the equipment is most important?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things in a messy kitchen?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 good restaurants?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___ crash',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are the 4 most photographed things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 of the most intelligent animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have dated the most?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of phones?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 sports bad for people who hate getting dirty?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? father___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people often lose?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 Jobs that require you be truthful?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have locked their keys in the car?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of TV?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 goofy-looking animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill the blank? I put ___ on my cereal?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Africa?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 lunch foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 cuddly animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 unusual ice cream flavors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 car brands that would make good names for a pet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? ___ring',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 3 generals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 jobs you don't want if you can't stand the sight of blood?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have run out of gas?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of the 1950s?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 pink things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would do best a karaoke?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 famous cats?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? When Johny ran out of the bank he had just robbed',
    FIELD2: ' he was surprised to see his car had ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 great foods to throw in a food fight?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things only the super rich would purchase?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 kinds of apples?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have the best hand-eye coordination?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of the 1980s?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 kinds of pillow?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room have the best hair?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of the Pope?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cartoon dogs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? bell___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that rhyme with "burst"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 omens of bad luck?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 words that begin with "C"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things in outer space?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 kinds of soup?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 small U.S. states?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 parts of a boat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 nursery rhymes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? magic___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come to mind when you think of apples?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 kitchen appliances that are built in?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 fish?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 yellow fruits?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 orange things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would make the best sailors?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you. think of Mexico?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cheeses?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___night',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 2 vegetarian meals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 activities that take place at a kid's birthday party?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things found in a castle?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 Pokemon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 men\'s names beginning with "J"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 pet names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 thin things/',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 chewy foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 materials?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? long__',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 puzzles?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 way to fill in the blank? chocolate__',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things kids wear that adults do not?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 tall things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 ways to fill in the blank? The witch didn't ride a broom; she rode a ___.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that might cause a judge to be lenient in the sentencing?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 men\'s names beginning with "W"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 4 women's names that are also English words?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 women\'s name beginning with "M"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 men\'s names beginning with "I"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 5 men's names that are 3 letters long?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? Matilda left the ___ on.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 nuts?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___out',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways people keep burglars out of their house?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 fictional places?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Before doing a project',
    FIELD2: ' William always liked to ___.',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that rhyme with "bear"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 outdated modes of transportation?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room got up latest this morning?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you might find on a pirate ship?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 animals that begin with the letter "W"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways to fill in the blank? time___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words a referee might say in a football game?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 industries with strange advertisements?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 articles of old-fashioned clothing?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things you need to go bowling?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 balls you would be surprised to see pitched in a baseball game?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 ways you might procrastinate?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are the 3 most forgettable presidents?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 classic science fiction movies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? bottle___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 video game consoles?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 instruments without string?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 animals that are at most zoos?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 TV stations?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 mountains?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room were most likely to stand up to a bully in school?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of amusement parks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 salads?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? ___mark',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 3 historical figures would you most like to meet?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 popular pets besides cats and dogs?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 animals with 5-letter names?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of fruit trees?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places you might go early in the morning?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would least enjoy being lumberjacks?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of Australia?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 cloth things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Margaret built a ___ out of spare parts.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come to mind when you think of Canada?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 parts of the car everyone has seen?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 big things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of music?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 places you might have a picnic?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room would look coolest in a black leather jacket?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come to mind when you think of babies?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 healthy foods that taste good?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Wow! For a robot',
    FIELD2: " you're very ___.",
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things that come in boxes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 large musical instruments?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 black things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of paper?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 colors of M&Ms?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? drive___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 villains Batman might fight?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 light fixtures?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 cartoon animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of rice?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 little birds?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 blue things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of shoes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 high-calorie foods?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? There was hardly anything to eat in the fridge; just ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that might keep you awake?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 little fish?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 cities?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 types of weapon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 local bodies of water?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 famous Bills?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 U.S. cities that would make good names for a child?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 of Santa's reindeer?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? Miss___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 volcanoes?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 sports in which you serve a ball?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 words that begin with "P"?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 things that come to mind when you think of Chicago?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 sports that are considered graceful?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are most likely to speak Latin?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you use to clean the house?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things at the bottom of the ocean?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Who are 5 Disney princesses?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 unusual meats people eat?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 tests a doctor might run?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? I answered the door wearing only ___.',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things someone would take off their hat to do?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 smart animals?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'Which 2 people in the room are the most likely to enjoy watching a scary movie?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things you see a lot in Hawaii?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 shiny things?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 ways to fill in the blank? Don't burn your ___.",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things people do when looking for a job?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 animals you can ride?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to fill in the blank? rain___',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 things that come to mind when you think of the 1990s?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 foods you eat with a spoon?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you might grow in a garden?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: "What are 3 things you don't want to do right before going to bed?",
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 food dishes that are difficult to make?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 5 things you hold?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 salad dressings?',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 kinds of snakes',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 4 ways to fill in the blank? ___boat',
    FIELD2: '',
    FIELD3: '',
  },
  {
    suffix: 'What are 3 ways to describe a genius besides "genius"?',
    FIELD2: '',
    FIELD3: '',
  },
];
