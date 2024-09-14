// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitPairsPayload } from './types';
import { DUETOS_ACTIONS } from './constants';

export function useOnSubmitPairsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
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
      action: DUETOS_ACTIONS.SUBMIT_PAIRS,
      ...payload,
    });
  };
}
