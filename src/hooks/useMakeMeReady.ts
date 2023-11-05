import { GAME_API, GAME_API_ACTIONS } from 'services/adapters';
import { useLanguage } from './useLanguage';
import { UseAPICallArgs, useAPICall } from './useAPICall';

type UseOnMakeMeReady = Omit<UseAPICallArgs, 'apiFunction' | 'actionName'>;

export function useOnMakeMeReady(args: UseOnMakeMeReady) {
  const { translate } = useLanguage();

  const { successMessage, errorMessage, ...rest } = args;

  const request = useAPICall({
    apiFunction: GAME_API.run,
    actionName: 'be-ready',
    successMessage: translate('Você está pronto!', 'You are ready!', successMessage),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar marcar você como pronto',
      'Oops, the application found an error while trying to set you ready',
      errorMessage
    ),
    ...rest,
  });

  return () => {
    request({
      action: GAME_API_ACTIONS.MAKE_PLAYER_READY,
    });
  };
}
