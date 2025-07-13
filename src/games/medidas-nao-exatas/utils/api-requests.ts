// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitGuessPayload, SubmitMetricsPayload, SubmitPoolPayload } from './types';
import { MEDIDAS_NAO_EXATAS_ACTIONS } from './constants';

export function useOnSubmitPoolAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-pool',
    successMessage: translate('Palavras submetidas com sucesso', 'Words submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas palavras',
      'Oops, the application found an error while trying to submit your words',
    ),
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
    successMessage: translate('Métricas submetidas com sucesso', 'Metrics submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas métricas',
      'Oops, the application found an error while trying to submit your metrics',
    ),
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
    successMessage: translate('Palpite adivinhada com sucesso', 'Guess submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao enviar seu palpite',
      'Oops, the application found an error while trying to submit your guess',
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: MEDIDAS_NAO_EXATAS_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
