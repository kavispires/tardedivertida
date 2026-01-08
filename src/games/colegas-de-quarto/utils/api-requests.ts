// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitCluesPayload, SubmitGuessesPayload, SubmitWordsPayload } from './types';
import { COLEGAS_DE_QUARTO_ACTIONS } from './constants';

export function useOnSubmitWordsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-words',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Palavras enviadas com sucesso', 'Words submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas palavras',
      'Oops, the application failed to send your words',
    ),
  });

  return (payload: SubmitWordsPayload) => {
    request({
      action: COLEGAS_DE_QUARTO_ACTIONS.SUBMIT_WORDS,
      ...payload,
    });
  };
}

export function useOnSubmitCluesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-clues',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Dicas submetidas com sucesso', 'Clues submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas dicas',
      'Oops, the application found an error while trying to submit your clues',
    ),
  });

  return (payload: SubmitCluesPayload) => {
    request({
      action: COLEGAS_DE_QUARTO_ACTIONS.SUBMIT_CLUES,
      ...payload,
    });
  };
}

export function useOnSubmitGuessesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guesses',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Palpites submetidos com sucesso', 'Guesses submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus palpites',
      'Oops, the application found an error while trying to submit your guesses',
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: COLEGAS_DE_QUARTO_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
