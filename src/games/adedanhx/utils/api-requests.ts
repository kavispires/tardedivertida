import { ADEDANHX_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitAnswersAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ADEDANHX_API.submitAction,
    actionName: 'submit-answers',
    onSuccess: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Respostas submetidas com sucesso', 'Answers submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application found an error while trying to submit your answers'
    ),
  });

  return (payload: SubmitGridAnswersPayload) => {
    request({
      action: 'SUBMIT_ANSWERS',
      ...payload,
    });
  };
}

export function useOnNextEvaluationGroupAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ADEDANHX_API.submitAction,
    actionName: 'go-to-next-evaluation-group',

    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return () => {
    request({
      action: 'NEXT_EVALUATION_GROUP',
    });
  };
}

export function useOnRejectAnswersAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ADEDANHX_API.submitAction,
    actionName: 'go-to-next-evaluation-group',

    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitRejectedAnswers) => {
    request({
      action: 'SUBMIT_REJECTED_ANSWERS',
      ...payload,
    });
  };
}
