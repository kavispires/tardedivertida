// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitEvaluationsPayload, SubmitGridAnswersPayload } from './types';
import { ADEDANHX_ACTIONS } from './constants';

export function useOnSubmitAnswersAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-answers',
    onSuccess: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Respostas submetidas com sucesso', 'Answers submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application found an error while trying to submit your answers',
    ),
  });

  return (payload: SubmitGridAnswersPayload) => {
    request({
      action: ADEDANHX_ACTIONS.SUBMIT_ANSWERS,
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationsAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-evaluations',

    successMessage: translate('Avaliação submetida com sucesso', 'Evaluation submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua avaliação',
      'Oops, the application found an error while trying to submit your evaluation',
    ),
  });

  return (payload: SubmitEvaluationsPayload) => {
    request({
      action: ADEDANHX_ACTIONS.SUBMIT_EVALUATIONS,
      ...payload,
    });
  };
}
