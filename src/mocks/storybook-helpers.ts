import { mockAdmin, mockGlobalUser, mockLanguage, mockLoading, mockPlayers } from '.';

export const getLanguageControl = () => ({
  _withLanguage: {
    control: 'inline-radio',
    options: ['pt', 'en'],
    defaultValue: 'pt',
    description: '[internal] Changes language',
  },
});

export const getUserControls = () => ({
  _withUser: {
    control: 'boolean',
    defaultValue: false,
    description: '[internal] Mocks active user',
  },
});

export const getAdminControls = () => ({
  _withAdmin: {
    control: 'boolean',
    defaultValue: false,
    description: '[internal] Mocks admin user',
  },
});

export const getLoadingControls = () => ({
  _withLoading: {
    control: 'boolean',
    defaultValue: false,
    description: '[internal] Mocks app loading state',
  },
});

export const getPlayersControls = () => ({
  _withPlayers: {
    control: {
      type: 'range',
      min: 0,
      max: 8,
      step: 1,
    },
    defaultValue: 0,
    description: '[internal] Mocks given number of players',
  },
});

export const getHooksControls = () => ({
  ...getUserControls(),
  ...getAdminControls(),
  ...getLoadingControls(),
  ...getPlayersControls(),
});

export const mockLanguageHook = (args: StorybookHookArgs) => {
  mockLanguage(args?._withLanguage ?? 'pt');
};

export const mockLoadingHook = (args: StorybookHookArgs) => {
  mockLoading(args?._withLoading ?? false);
};

export const mockHooks = (args: StorybookHookArgs) => {
  mockLoading(args._withLoading);
  mockGlobalUser({}, !args._withUser);
  mockAdmin(args._withAdmin);
  const players = args._withPlayers ? mockPlayers(args._withPlayers) : {};
  return { ...args, players };
};
