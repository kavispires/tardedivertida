import { GAME_API_COMMON_ACTIONS } from 'services/adapters';
import { useLanguage } from './useLanguage';
import { UseAPICallArgs } from './useAPICall';
import { useGameActionRequest } from './useGameActionRequest';

type UseOnMakeMeReady = Omit<UseAPICallArgs, 'apiFunction' | 'actionName'>;

export function useOnMakeMeReady(args: UseOnMakeMeReady) {
  const { translate } = useLanguage();

  const { successMessage, errorMessage, ...rest } = args;

  const request = useGameActionRequest({
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
      action: GAME_API_COMMON_ACTIONS.MAKE_ME_READY,
    });
  };
}
