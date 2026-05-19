// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import { CRIMES_HEDIONDOS_ACTIONS } from './constants';
import type { SubmitCrimePayload, SubmitGuessesPayload, SubmitMarkPayload } from './types';

export function useOnSubmitCrimeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-crime',
    onBeforeCall: () => setStep(11),
    onError: () => setStep(9),
    successMessage: translate({ pt: 'Crime enviado com sucesso', en: 'Crime submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu crime',
      en: 'Oops, the application failed to send your crime',
    }),
  });

  return (payload: SubmitCrimePayload) => {
    request({
      action: CRIMES_HEDIONDOS_ACTIONS.SUBMIT_CRIME,
      ...payload,
    });
  };
}

export function useOnSubmitMarkAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-mark',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate({
      pt: 'Nova informação enviadas com sucesso',
      en: 'New information submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a nova informação',
      en: 'Oops, the application failed to send the new information',
    }),
  });

  return (payload: SubmitMarkPayload) => {
    request({
      action: CRIMES_HEDIONDOS_ACTIONS.SUBMIT_MARK,
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
      action: CRIMES_HEDIONDOS_ACTIONS.SUBMIT_GUESSES,
      ...payload,
    });
  };
}
