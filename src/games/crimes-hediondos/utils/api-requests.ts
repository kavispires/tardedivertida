import { SubmitCrimePayload, SubmitGuessesPayload, SubmitMarkPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'crimesHediondosSubmitAction');

export function useOnSubmitCrimeAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-crime',
    onBeforeCall: () => setStep(11),
    onError: () => setStep(9),
    successMessage: translate('Crime enviado com sucesso', 'Crime submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu crime',
      'Oops, the application failed to send your crime'
    ),
  });

  return (payload: SubmitCrimePayload) => {
    request({
      action: 'SUBMIT_CRIME',
      ...payload,
    });
  };
}

export function useOnSubmitMarkAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-mark',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate(
      'Nova informação enviadas com sucesso',
      'New information submitted successfully'
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a nova informação',
      'Oops, the application failed to send the new information'
    ),
  });

  return (payload: SubmitMarkPayload) => {
    request({
      action: 'SUBMIT_MARK',
      ...payload,
    });
  };
}

export function useOnSubmitGuessesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
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
      action: 'SUBMIT_GUESSES',
      ...payload,
    });
  };
}
