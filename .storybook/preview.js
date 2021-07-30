import '../src/styles/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  controls: { expanded: true },
  backgrounds: {
    default: 'green',
    values: [
      { name: 'yellow', value: '#f2e863' },
      { name: 'green', value: '#44bba4' },
      { name: 'purple', value: '#3e1e68' },
    ],
  },
};
