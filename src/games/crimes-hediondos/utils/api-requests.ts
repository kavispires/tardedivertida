import { CRIMES_HEDIONDOS_API } from 'services/adapters';
import { useAPICall, useLanguage } from 'hooks';

export function useOnSubmitCrimeAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
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

export function useOnSubmitMarkAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
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

export function useOnSubmitGuessesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
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
