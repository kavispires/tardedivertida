import { GAME_API_V1, GAME_API_ACTIONS_V1 } from 'services/adapters';
import { useLanguage } from './useLanguage';
import { UseAPICallArgs, useAPICall } from './useAPICall';

type UseOnMakeMeReady = Omit<UseAPICallArgs, 'apiFunction' | 'actionName'>;

export function useOnMakeMeReady(args: UseOnMakeMeReady) {
  const { translate } = useLanguage();

  const { successMessage, errorMessage, ...rest } = args;

  const request = useAPICall({
    apiFunction: GAME_API_V1.run,
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
      action: GAME_API_ACTIONS_V1.MAKE_PLAYER_READY,
    });
  };
}
