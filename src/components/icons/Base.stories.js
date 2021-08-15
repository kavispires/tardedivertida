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
    component: <icons.CrimeScene />,
    name: 'CrimeScene',
  },
  {
    component: <icons.Criminal />,
    name: 'Criminal',
  },
  {
    component: <icons.Defense />,
    name: 'Defense',
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
    component: <icons.Investigation />,
    name: 'Investigation',
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
    component: <icons.Picture />,
    name: 'Picture',
  },
  {
    component: <icons.Rank />,
    name: 'Rank',
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
    component: <icons.Trophy />,
    name: 'Trophy',
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
