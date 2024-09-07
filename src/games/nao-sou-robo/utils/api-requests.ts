import type { SubmitRobotCardPayload, SubmitRobotGuessPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';

import { NAO_SOU_ROBO_ACTIONS } from './constants';

export function useOnSubmitCardAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Carta submetida com sucesso', 'Card submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card'
    ),
  });

  return (payload: SubmitRobotCardPayload) => {
    request({
      action: NAO_SOU_ROBO_ACTIONS.SUBMIT_CARD,
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
    successMessage: translate('Adivinhação submetida com sucesso', 'Guess submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua adivinhação',
      'Oops, the application found an error while trying to submit your guess'
    ),
  });

  return (payload: SubmitRobotGuessPayload) => {
    request({
      action: NAO_SOU_ROBO_ACTIONS.SUBMIT_GUESS,
      ...payload,
    });
  };
}
