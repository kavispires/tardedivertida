// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitCluePayload, SubmitGuessesPayload, SubmitWordsPayload } from './types';
import { CRUZA_PALAVRAS_ACTIONS } from './constants';


export function useOnSubmitWordsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-words',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Palavras enviadas com sucesso', 'Words submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas palavras',
      'Oops, the application failed to send your words'
    ),
  });

  return (payload: SubmitWordsPayload) => {
    request({
      action: CRUZA_PALAVRAS_ACTIONS.SUBMIT_WORDS,
      ...payload,
    });
  };
}

export function useOnSubmitClueAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Dica enviada com sucesso', 'Clue submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua dica',
      'Oops, the application failed to send your clue'
    ),
  });

  return (payload: SubmitCluePayload) => {
    request({
      action: CRUZA_PALAVRAS_ACTIONS.SUBMIT_CLUE,
      ...payload,
    });
  };
}

export function useOnSubmitGuessesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guesses',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso', 'Guesses submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application failed to send your guesses'
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: CRUZA_PALAVRAS_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
