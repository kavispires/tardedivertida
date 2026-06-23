// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitAnswerPayload } from './types';
import { MEGAMIX_ACTIONS } from './constants';

export function useOnSubmitSeedAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-seed',
    onSuccess: () => setStep(3),
    successMessage: translate({ pt: 'Dados enviados com sucesso', en: 'Data submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seus dados',
      en: 'Oops, the application found an error while trying to submit your data',
    }),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: MEGAMIX_ACTIONS.SUBMIT_SEEDS,
      ...payload,
    });
  };
}

export function useOnSubmitTrackAnswerAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-task',
    onSuccess: () => setStep(3),
    successMessage: translate({ pt: 'Tarefa enviada com sucesso', en: 'Track submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua tarefa',
      en: 'Oops, the application found an error while trying to submit your task',
    }),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: MEGAMIX_ACTIONS.SUBMIT_TRACK_ANSWER,
      ...payload,
    });
  };
}
