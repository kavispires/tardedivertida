// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import { MENTE_COLETIVA_ACTIONS } from './constants';
import type {
  AddAnswerPayload,
  NextAnswersPayload,
  SubmitAnswersPayload,
  SubmitCustomQuestionPayload,
  SubmitQuestionPayload,
} from './types';

export function useOnSubmitQuestionAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-question',
    onSuccess: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Pergunta enviada com sucesso!', en: 'Question send successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta',
      en: 'Oops, the application failed to submit the question',
    }),
  });

  return (payload: SubmitQuestionPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.SUBMIT_QUESTION,
      ...payload,
    });
  };
}

export function useOnSubmitCustomQuestionAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-question',
    onSuccess: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Pergunta enviada com sucesso!', en: 'Question send successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a pergunta',
      en: 'Oops, the application failed to submit the question',
    }),
  });

  return (payload: SubmitCustomQuestionPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.SUBMIT_CUSTOM_QUESTION,
      ...payload,
    });
  };
}

export function useOnSubmitAnswersAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-answers',
    onSuccess: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Respostas enviadas com sucesso!', en: 'Answers send successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar respostas',
      en: 'Oops, the application failed to submit answers',
    }),
  });

  return (payload: SubmitAnswersPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.SUBMIT_ANSWERS,
      ...payload,
    });
  };
}

export function useOnAddAnswerAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'add-answer',
    successMessage: translate({ pt: 'Resposta adicionada com sucesso!', en: 'Answer added successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar adicionar respostar',
      en: 'Oops, the application failed to add answer',
    }),
  });

  return (payload: AddAnswerPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.ADD_ANSWER,
      ...payload,
    });
  };
}

export function useOnNextAnswersAPIRequest(clearAllowList: () => void) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'next-answers',
    onSuccess: clearAllowList,
    successMessage: translate({
      pt: 'Próximas respostas acionadas com sucesso!',
      en: 'Next answers triggered successfully!',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar avançar',
      en: 'Oops, the application failed to advance',
    }),
  });

  return (payload: NextAnswersPayload) => {
    request({
      action: MENTE_COLETIVA_ACTIONS.NEXT_ANSWERS,
      ...payload,
    });
  };
}
