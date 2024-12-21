// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import { TA_NA_CARA_ACTIONS } from './constants';
import type {
  SubmitAnswerPayload,
  SubmitGuessPayload,
  SubmitPromptPayload,
  SubmitTargetPayload,
} from './types';

export function useOnSubmitPromptAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-prompt',
    onSuccess: () => setStep(2),
    successMessage: translate('Pergunta submetida com sucesso', 'Question submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pergunta',
      'Oops, the application found an error while trying to submit your question',
    ),
  });

  return (payload: SubmitPromptPayload) => {
    request({
      action: TA_NA_CARA_ACTIONS.SUBMIT_PROMPT,
      ...payload,
    });
  };
}

export function useOnSubmitTargetAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-target',
    onSuccess: () => setStep(2),
    successMessage: translate('Alvo submetida com sucesso', 'Target submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu alvo',
      'Oops, the application found an error while trying to submit your target',
    ),
  });

  return (payload: SubmitTargetPayload) => {
    request({
      action: TA_NA_CARA_ACTIONS.SUBMIT_TARGET,
      ...payload,
    });
  };
}

export function useOnSubmitAnswerAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-answer',
    successMessage: translate('Resposta submetida com sucesso', 'Answer submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta',
      'Oops, the application found an error while trying to submit your answer',
    ),
  });

  return (payload: SubmitAnswerPayload) => {
    request({
      action: TA_NA_CARA_ACTIONS.SUBMIT_ANSWER,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    onSuccess: () => setStep(2),
    actionName: 'submit-guess',
    successMessage: translate('Palpite submetido com sucesso', 'Guess submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu palpite',
      'Oops, the application found an error while trying to submit your guess',
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: TA_NA_CARA_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
