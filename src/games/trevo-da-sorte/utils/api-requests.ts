import { TREVO_DA_SORTE_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import { ACTIONS } from './constants';

export function useOnSubmitBadWordsAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: TREVO_DA_SORTE_API.submitAction,
    actionName: 'submit-bad-words',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Palavras ruins enviadas com sucesso!', 'Bad words submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar palavras',
      'Oops, the application failed to submit words'
    ),
  });

  return (payload: SubmitBadWordsPayload) => {
    request({
      action: ACTIONS.SUBMIT_BAD_WORDS,
      ...payload,
    });
  };
}

export function useOnSubmitCluesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: TREVO_DA_SORTE_API.submitAction,
    actionName: 'submit-clues',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Dicas enviadas com sucesso!', 'Clues submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar dicas',
      'Oops, the application failed to submit clues'
    ),
  });

  return (payload: SubmitCluesPayload) => {
    request({
      action: ACTIONS.SUBMIT_CLUES,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: TREVO_DA_SORTE_API.submitAction,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Palpites enviadas com sucesso!', 'Guesses submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar palpites',
      'Oops, the application failed to submit guesses'
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}

export function useOnUpdateCloverStateAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: TREVO_DA_SORTE_API.submitAction,
    actionName: 'update-clover-state',
    // successMessage: translate('Dicas enviadas com sucesso!', 'Clues submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar o trevo',
      'Oops, the application failed to update the clover'
    ),
  });

  return (payload: UpdateCoverStatePayload) => {
    request({
      action: ACTIONS.UPDATE_CLOVER_STATE,
      ...payload,
    });
  };
}
