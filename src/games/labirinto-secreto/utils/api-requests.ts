import type { SubmitMapPayload, SubmitPathGuessPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'labirintoSecretoSubmitAction');

export function useOnSubmitMapAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-map',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Mapa submetido com sucesso', 'Map submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu mapa',
      'Oops, the application found an error while trying to submit your map'
    ),
  });

  return (payload: SubmitMapPayload) => {
    request({
      action: 'SUBMIT_MAP',
      ...payload,
    });
  };
}

export function useOnSubmitPathAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-path',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Caminho submetido com sucesso', 'Path submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu caminho',
      'Oops, the application found an error while trying to submit your path'
    ),
  });

  return (payload: SubmitPathGuessPayload) => {
    request({
      action: 'SUBMIT_PATH',
      ...payload,
    });
  };
}
