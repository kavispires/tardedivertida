// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitGuessPayload, SubmitMetricsPayload, SubmitPoolPayload } from './types';
import { MEDIDAS_NAO_EXATAS_ACTIONS } from './constants';

export function useOnSubmitPoolAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-pool',
    successMessage: translate({ pt: 'Palavras submetidas com sucesso', en: 'Words submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas palavras',
      en: 'Oops, the application found an error while trying to submit your words',
    }),
  });

  return (payload: SubmitPoolPayload) => {
    request({
      action: MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_POOL,
      ...payload,
    });
  };
}

export function useOnSubmitMetricsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-metrics',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Métricas submetidas com sucesso',
      en: 'Metrics submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas métricas',
      en: 'Oops, the application found an error while trying to submit your metrics',
    }),
  });

  return (payload: SubmitMetricsPayload) => {
    request({
      action: MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_METRICS,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guess',
    successMessage: translate({ pt: 'Palpite enviado com sucesso', en: 'Guess submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao enviar seu palpite',
      en: 'Oops, the application found an error while trying to submit your guess',
    }),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
