import type {
  SendGuessPayload,
  SubmitOutcomePayload,
  SubmitSuggestionsPayload,
  SubmitValidationsPayload,
  SubmitVotesPayload,
  ValidateSuggestionPayload,
} from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'ueSoIssoSubmitAction');

export function useOnSubmitVotesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Votos enviados com sucesso!', 'Votes send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
      'Oops, the application failed to send your votes'
    ),
  });

  return (payload: SubmitVotesPayload) => {
    request({
      action: 'SUBMIT_VOTES',
      ...payload,
    });
  };
}

export function useOnSubmitSuggestionsAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-suggestion',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Dicas enviada com sucesso!', 'Suggestions sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas dicas',
      'Oops, the application failed to send your suggestions'
    ),
  });

  return (payload: SubmitSuggestionsPayload) => {
    request({
      action: 'SUBMIT_SUGGESTIONS',
      ...payload,
    });
  };
}

export function useOnSubmitValidationsAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-validations',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Validação enviada com sucesso!', 'Validation sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a validação das sugestões',
      'Oops, the application failed to send the validation'
    ),
  });

  return (payload: SubmitValidationsPayload) => {
    request({
      action: 'SUBMIT_VALIDATION',
      ...payload,
    });
  };
}

export function useOnValidateSuggestionAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'validate-suggestion',
    successMessage: translate('Atualizado!', 'Updated!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application failed to update'
    ),
  });

  return (payload: ValidateSuggestionPayload) => {
    request({
      action: 'VALIDATE_SUGGESTION',
      ...payload,
    });
  };
}

export function useOnSubmitOutcomeAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-outcome',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Resultado enviado com sucesso!', 'Outcome sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o resultado',
      'Oops, the application failed to submit the outcome'
    ),
  });

  return (payload: SubmitOutcomePayload) => {
    request({
      action: 'SUBMIT_OUTCOME',
      ...payload,
    });
  };
}

export function useOnSendGuessAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'send-guess',
    successMessage: translate('Chute enviado!', 'Guess sent!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar',
      'Oops, the application failed to update'
    ),
  });

  return (payload: SendGuessPayload) => {
    request({
      action: 'SEND_GUESS',
      ...payload,
    });
  };
}
