// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitPatternPayload } from './types';
import { SENSO_LITERARIO_ACTIONS } from './constants';

export function useOnSubmitPatternAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-pattern',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Carta submetida com sucesso', en: 'Card submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      en: 'Oops, the application found an error while trying to submit your card',
    }),
  });

  return (payload: SubmitPatternPayload) => {
    request({
      action: SENSO_LITERARIO_ACTIONS.SUBMIT_PATTERN,
      ...payload,
    });
  };
}
