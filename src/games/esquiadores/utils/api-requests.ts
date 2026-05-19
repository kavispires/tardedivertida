// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitBetsPayload, SubmitChoicesPayload } from './types';
import { ESQUIADORES_ACTIONS } from './constants';

export function useOnSubmitChoicesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-choices',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate({ pt: 'Escolhas enviadas com sucesso', en: 'Choices submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas escolhas',
      en: 'Oops, the application failed to send your choices',
    }),
  });

  return (payload: SubmitChoicesPayload) => {
    request({
      action: ESQUIADORES_ACTIONS.SUBMIT_CHOICES,
      ...payload,
    });
  };
}

export function useOnSubmitBetsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-bets',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate({ pt: 'Apostas enviadas com sucesso', en: 'Bets submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas apostas',
      en: 'Oops, the application failed to send your bets',
    }),
  });

  return (payload: SubmitBetsPayload) => {
    request({
      action: ESQUIADORES_ACTIONS.SUBMIT_BETS,
      ...payload,
    });
  };
}
