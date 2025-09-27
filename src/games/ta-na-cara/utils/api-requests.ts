// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import { TA_NA_CARA_ACTIONS } from './constants';
import type {
  SubmitAnswerPayload,
  SubmitGuessesPayload,
  SubmitIdentityPayload,
  SubmitPromptPayload,
} from './types';

export function useOnSubmitIdentityAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-identity',
    onSuccess: () => setStep(2),
    successMessage: translate('Identidade submetida com sucesso', 'Identity submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua identidade',
      'Oops, the application found an error while trying to submit your identity',
    ),
  });

  return (payload: SubmitIdentityPayload) => {
    request({
      action: TA_NA_CARA_ACTIONS.SUBMIT_IDENTITY,
      ...payload,
    });
  };
}

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

export function useOnSubmitAnswerAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    onSuccess: () => setStep(1),
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

export function useOnSubmitGuessesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    onSuccess: () => setStep(2),
    actionName: 'submit-guesses',
    successMessage: translate('Palpites submetidos com sucesso', 'Guesses submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu palpites',
      'Oops, the application found an error while trying to submit your guesses',
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: TA_NA_CARA_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
