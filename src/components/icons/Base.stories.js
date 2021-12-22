import React from 'react';

import * as icons from './index';
import { Base } from './Base';

export default {
  title: 'icons/Icon',
  component: Base,
  argTypes: {},
};

const components = [
  {
    component: <icons.Arrow />,
    name: 'Arrow',
  },
  {
    component: <icons.Chat />,
    name: 'Chat',
  },
  {
    component: <icons.Clock />,
    name: 'Clock',
  },
  {
    component: <icons.Countdown />,
    name: 'Countdown',
  },
  {
    component: <icons.CrimeScene />,
    name: 'CrimeScene',
  },
  {
    component: <icons.Criminal />,
    name: 'Criminal',
  },
  {
    component: <icons.CustomerReview />,
    name: 'CustomerReview',
  },
  {
    component: <icons.Defense />,
    name: 'Defense',
  },
  {
    component: <icons.Discussion />,
    name: 'Discussion',
  },
  {
    component: <icons.Dream />,
    name: 'Dream',
  },
  {
    component: <icons.Evaluate />,
    name: 'Evaluate',
  },
  {
    component: <icons.Eye />,
    name: 'Eye',
  },
  {
    component: <icons.FairyTale />,
    name: 'FairyTale',
  },
  {
    component: <icons.Feedback />,
    name: 'Feedback',
  },
  {
    component: <icons.Flag />,
    name: 'Flag',
  },
  {
    component: <icons.Gears />,
    name: 'Gears',
  },
  {
    component: <icons.Guess />,
    name: 'Guess',
  },
  {
    component: <icons.HangingPhotograph />,
    name: 'HangingPhotograph',
  },
  {
    component: <icons.ImageCards />,
    name: 'ImageCards',
  },
  {
    component: <icons.Investigation />,
    name: 'Investigation',
  },
  {
    component: <icons.Knowledge />,
    name: 'Knowledge',
  },
  {
    component: <icons.Ladder />,
    name: 'Ladder',
  },
  {
    component: <icons.Law />,
    name: 'Law',
  },
  {
    component: <icons.LoadingClock />,
    name: 'LoadingClock',
  },
  {
    component: <icons.Multitask />,
    name: 'Multitask',
  },
  {
    component: <icons.Newspaper />,
    name: 'Newspaper',
  },
  {
    component: <icons.Opinions />,
    name: 'Opinions',
  },
  {
    component: <icons.Painting />,
    name: 'Painting',
  },
  {
    component: <icons.Panic />,
    name: 'Panic',
  },
  {
    component: <icons.Picture />,
    name: 'Picture',
  },
  {
    component: <icons.Rank />,
    name: 'Rank',
  },
  {
    component: <icons.Review />,
    name: 'Review',
  },
  {
    component: <icons.Seal />,
    name: 'Seal',
  },
  {
    component: <icons.Secret />,
    name: 'Secret',
  },
  {
    component: <icons.Sheep />,
    name: 'Sheep',
  },
  {
    component: <icons.SoundWave />,
    name: 'SoundWave',
  },
  {
    component: <icons.TheEnd />,
    name: 'TheEnd',
  },
  {
    component: <icons.Timer />,
    name: 'Timer',
  },
  {
    component: <icons.Trending />,
    name: 'Trending',
  },
  {
    component: <icons.Trophy />,
    name: 'Trophy',
  },
  {
    component: <icons.Turban />,
    name: 'Turban',
  },
  {
    component: <icons.VerifyList />,
    name: 'VerifyList',
  },
  {
    component: <icons.VideoGameController />,
    name: 'VideoGameController',
  },
  {
    component: <icons.Vote />,
    name: 'Vote',
  },
  {
    component: <icons.Witness />,
    name: 'Witness',
  },
  {
    component: <icons.Writing />,
    name: 'Writing',
  },
];

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px',
  },
  name: {
    display: 'block',
    textAlign: 'center',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: '5px',
    padding: '5px',
    marginTop: '10px',
  },
};

const Template = (args) => {
  return (
    <div style={styles.container}>
      {components.map(({ component, name }) => (
        <div key={name} style={styles.iconContainer}>
          {component}
          <span style={styles.name}>{name}</span>
        </div>
      ))}
    </div>
  );
};

export const Default = Template.bind({});
