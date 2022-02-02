import { MENTE_COLETIVA_API } from '../../adapters';

import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitQuestionAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'submit-question',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Pergunta enviada com sucesso!', 'Question send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta',
      'Oops, the application failed to submit the question'
    ),
  });

  return (payload: SubmitQuestionPayload) => {
    request({
      action: 'SUBMIT_QUESTION',
      ...payload,
    });
  };
}

export function useOnSubmitAnswersAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'submit-answers',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso!', 'Answers send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar respostas',
      'Oops, the application failed to submit answers'
    ),
  });

  return (payload: SubmitAnswersPayload) => {
    request({
      action: 'SUBMIT_ANSWERS',
      ...payload,
    });
  };
}

export function useOnAddAnswerAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'add-answer',
    successMessage: translate('Resposta adicionada com sucesso!', 'Answer added successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar adicionar respostar',
      'Oops, the application failed to add answer'
    ),
  });

  return (payload: AddAnswerPayload) => {
    request({
      action: 'ADD_ANSWER',
      ...payload,
    });
  };
}

export function useOnNextAnswersAPIRequest(clearAllowList: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'next-answers',
    onSuccess: clearAllowList,
    successMessage: translate(
      'Próximas respostas acionadas com sucesso!',
      'Next answers triggered successfully!'
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar avançar',
      'Oops, the application failed to advance'
    ),
  });

  return (payload: NextAnswersPayload) => {
    request({
      action: 'NEXT_ANSWERS',
      ...payload,
    });
  };
}
