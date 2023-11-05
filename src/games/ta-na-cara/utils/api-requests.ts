import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'taNaCaraSubmitAction');

export function useOnSubmitPromptAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-prompt',
    onSuccess: () => setStep(2),
    successMessage: translate('Pergunta submetida com sucesso', 'Question submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pergunta',
      'Oops, the application found an error while trying to submit your question'
    ),
  });

  return (payload: SubmitPromptPayload) => {
    request({
      action: 'SUBMIT_PROMPT',
      ...payload,
    });
  };
}

export function useOnSubmitTargetAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-target',
    onSuccess: () => setStep(2),
    successMessage: translate('Alvo submetida com sucesso', 'Target submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu alvo',
      'Oops, the application found an error while trying to submit your target'
    ),
  });

  return (payload: SubmitTargetPayload) => {
    request({
      action: 'SUBMIT_TARGET',
      ...payload,
    });
  };
}

export function useOnSubmitAnswerAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-answer',
    successMessage: translate('Resposta submetida com sucesso', 'Answer submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta',
      'Oops, the application found an error while trying to submit your answer'
    ),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: 'SUBMIT_ANSWER',
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    onSuccess: () => setStep(2),
    actionName: 'submit-guess',
    successMessage: translate('Palpite submetido com sucesso', 'Guess submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu palpite',
      'Oops, the application found an error while trying to submit your guess'
    ),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: 'SUBMIT_GUESS',
      ...payload,
    });
  };
}
