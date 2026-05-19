// Services
import { GAME_API_COMMON_ACTIONS } from 'services/adapters';
// Internal
import { useLanguage } from './useLanguage';
import { useGameActionRequest, type UseGameActionRequestArgs } from './useGameActionRequest';

type UseOnMakeMeReady = Omit<UseGameActionRequestArgs, 'actionName'>;

export function useOnMakeMeReady(args: UseOnMakeMeReady) {
  const { translate } = useLanguage();

  const { successMessage, errorMessage, ...rest } = args;

  const request = useGameActionRequest({
    actionName: 'be-ready',
    successMessage: translate({ pt: 'Você está pronto!', en: 'You are ready!', custom: successMessage }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar marcar você como pronto',
      en: 'Oops, the application found an error while trying to set you ready',
      custom: errorMessage,
    }),
    ...rest,
  });

  return () => {
    request({
      action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY,
    });
  };
}
