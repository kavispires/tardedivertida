import type { SubmitBadWordsPayload, SubmitCloverGuessesPayload, SubmitCluesPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';
import { ACTIONS } from './constants';

const submitAction = httpsCallable(functions, 'trevoDaSorteSubmitAction');

export function useOnSubmitBadWordsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
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

export function useOnSubmitCluesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
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

export function useOnSubmitGuessAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Palpites enviadas com sucesso!', 'Guesses submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar palpites',
      'Oops, the application failed to submit guesses'
    ),
  });

  return (payload: SubmitCloverGuessesPayload) => {
    request({
      action: ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
