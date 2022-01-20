import { MENTE_COLETIVA_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitQuestionAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'submit-question',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Pergunta enviada com sucesso!', 'Question send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta',
      'Oops, the application failed to submit the question',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'submit-answers',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso!', 'Answers send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar respostas',
      'Oops, the application failed to submit answers',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'add-answer',
    successMessage: translate('Resposta adicionada com sucesso!', 'Answer added successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar adicionar respostar',
      'Oops, the application failed to add answer',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: MENTE_COLETIVA_API.submitAction,
    actionName: 'next-answers',
    onSuccess: clearAllowList,
    successMessage: translate(
      'Próximas respostas acionadas com sucesso!',
      'Next answers triggered successfully!',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar avançar',
      'Oops, the application failed to advance',
      language
    ),
  });

  return (payload: NextAnswersPayload) => {
    request({
      action: 'NEXT_ANSWERS',
      ...payload,
    });
  };
}
