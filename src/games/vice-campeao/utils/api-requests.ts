// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitCardPayload } from './types';
import { VICE_CAMPEAO_ACTIONS } from './constants';

export function useOnSubmitCardAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-card',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Carta submetida com sucesso', en: 'Card submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitCardPayload) => {
    request({
      action: VICE_CAMPEAO_ACTIONS.SUBMIT_CARD,
      ...payload,
    });
  };
}
