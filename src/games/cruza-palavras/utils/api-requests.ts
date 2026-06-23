// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitCluePayload, SubmitGuessesPayload, SubmitWordsPayload } from './types';
import { CRUZA_PALAVRAS_ACTIONS } from './constants';

export function useOnSubmitWordsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-words',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Palavras enviadas com sucesso', en: 'Words submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas palavras',
      en: 'Oops, the application failed to send your words',
    }),
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
    successMessage: translate({ pt: 'Dica enviada com sucesso', en: 'Clue submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua dica',
      en: 'Oops, the application failed to send your clue',
    }),
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
    successMessage: translate({ pt: 'Respostas enviadas com sucesso', en: 'Guesses submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      en: 'Oops, the application failed to send your guesses',
    }),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: CRUZA_PALAVRAS_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
