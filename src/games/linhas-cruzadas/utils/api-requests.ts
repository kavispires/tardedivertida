// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitDrawingPayload, SubmitGuessPayload, SubmitPromptPayload } from './types';
import { LINHAS_CRUZADAS_ACTIONS } from './constants';

export function useOnSubmitPromptAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-prompt',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Carta enviada com sucesso!', en: 'Card send successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      en: 'Oops, the application failed to submit the card',
    }),
  });

  return (payload: SubmitPromptPayload) => {
    request({
      action: LINHAS_CRUZADAS_ACTIONS.SUBMIT_PROMPT,
      ...payload,
    });
  };
}

export function useOnSubmitDrawingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({
      pt: 'Acabou o tempo! Aguarde enquanto os outros participantes desenham',
      en: "Time's up! Wait for the other players to finish their art",
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
      en: 'Oops, the application failed to send your art',
    }),
  });

  return (payload: SubmitDrawingPayload) => {
    request({
      action: LINHAS_CRUZADAS_ACTIONS.SUBMIT_DRAWING,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Resposta enviado com sucesso!', en: 'Guess submitted successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta',
      en: 'Oops, the application failed to submit your guess',
    }),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: LINHAS_CRUZADAS_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
