// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import { UE_SO_ISSO_ACTIONS } from './constants';
import type {
  SendGuessPayload,
  SubmitOutcomePayload,
  SubmitSuggestionsPayload,
  SubmitValidationsPayload,
  SubmitVotesPayload,
  ValidateSuggestionPayload,
} from './types';

export function useOnSubmitVotesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Votos enviados com sucesso!', 'Votes send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
      'Oops, the application failed to send your votes',
    ),
  });

  return (payload: SubmitVotesPayload) => {
    request({
      action: UE_SO_ISSO_ACTIONS.SUBMIT_VOTES,
      ...payload,
    });
  };
}

export function useOnSubmitSuggestionsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-suggestion',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Dicas enviada com sucesso!', 'Suggestions sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas dicas',
      'Oops, the application failed to send your suggestions',
    ),
  });

  return (payload: SubmitSuggestionsPayload) => {
    request({
      action: UE_SO_ISSO_ACTIONS.SUBMIT_SUGGESTIONS,
      ...payload,
    });
  };
}

export function useOnSubmitValidationsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-validations',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Validação enviada com sucesso!', 'Validation sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a validação das sugestões',
      'Oops, the application failed to send the validation',
    ),
  });

  return (payload: SubmitValidationsPayload) => {
    request({
      action: UE_SO_ISSO_ACTIONS.SUBMIT_VALIDATION,
      ...payload,
    });
  };
}

export function useOnValidateSuggestionAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'validate-suggestion',
    successMessage: translate('Atualizado!', 'Updated!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application failed to update',
    ),
  });

  return (payload: ValidateSuggestionPayload) => {
    request({
      action: UE_SO_ISSO_ACTIONS.VALIDATE_SUGGESTION,
      ...payload,
    });
  };
}

export function useOnSubmitOutcomeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-outcome',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Resultado enviado com sucesso!', 'Outcome sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
      'Oops, the application failed to submit the outcome',
    ),
  });

  return (payload: SubmitOutcomePayload) => {
    request({
      action: UE_SO_ISSO_ACTIONS.SUBMIT_OUTCOME,
      ...payload,
    });
  };
}

export function useOnSendGuessAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'send-guess',
    successMessage: translate('Chute enviado!', 'Guess sent!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application failed to update',
    ),
  });

  return (payload: SendGuessPayload) => {
    request({
      action: UE_SO_ISSO_ACTIONS.SEND_GUESS,
      ...payload,
    });
  };
}
