// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitRobotCardsPayload, SubmitRobotGuessPayload } from './types';
import { NAO_SOU_ROBO_ACTIONS } from './constants';

export function useOnSubmitCardAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Carta submetida com sucesso', en: 'Card submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      en: 'Oops, the application found an error while trying to submit your card',
    }),
  });

  return (payload: SubmitRobotCardsPayload) => {
    request({
      action: NAO_SOU_ROBO_ACTIONS.SUBMIT_CARDS,
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-guess',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Adivinhação submetida com sucesso',
      en: 'Guess submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua adivinhação',
      en: 'Oops, the application found an error while trying to submit your guess',
    }),
  });

  return (payload: SubmitRobotGuessPayload) => {
    request({
      action: NAO_SOU_ROBO_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
