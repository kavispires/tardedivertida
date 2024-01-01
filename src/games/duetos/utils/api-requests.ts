import type { SubmitPairsPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'duetosSubmitAction');

export function useOnSubmitPairsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-pairs',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Pares submetidos com sucesso', 'Paris submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus pares',
      'Oops, the application found an error while trying to submit your pairs'
    ),
  });

  return (payload: SubmitPairsPayload) => {
    request({
      action: 'SUBMIT_PAIRS',
      ...payload,
    });
  };
}
