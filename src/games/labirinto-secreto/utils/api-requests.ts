// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitMapPayload, SubmitPathGuessPayload } from './types';
import { LABIRINTO_SECRETO_ACTIONS } from './constants';

export function useOnSubmitMapAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-map',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Mapa submetido com sucesso', 'Map submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu mapa',
      'Oops, the application found an error while trying to submit your map',
    ),
  });

  return (payload: SubmitMapPayload) => {
    request({
      action: LABIRINTO_SECRETO_ACTIONS.SUBMIT_MAP,
      ...payload,
    });
  };
}

export function useOnSubmitPathAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-path',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Caminho submetido com sucesso', 'Path submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu caminho',
      'Oops, the application found an error while trying to submit your path',
    ),
  });

  return (payload: SubmitPathGuessPayload) => {
    request({
      action: LABIRINTO_SECRETO_ACTIONS.SUBMIT_PATH,
      ...payload,
    });
  };
}
