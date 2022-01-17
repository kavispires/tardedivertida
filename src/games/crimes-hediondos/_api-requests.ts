import { CRIMES_HEDIONDOS_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitCrimeAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-crime',
    onBeforeCall: () => setStep(11),
    onError: () => setStep(9),
    successMessage: translate('Crime enviado com sucesso', 'Crime submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu crime',
      'Oops, the application failed to send your crime',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-mark',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate(
      'Nova informação enviadas com sucesso',
      'New information submitted successfully',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a nova informação',
      'Oops, the application failed to send the new information',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CRIMES_HEDIONDOS_API.submitAction,
    actionName: 'submit-guesses',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Respostas enviadas com sucesso', 'Guesses submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas respostas',
      'Oops, the application failed to send your guesses',
      language
    ),
  });

  return (payload: SubmitGuessesPayload) => {
    request({
      action: 'SUBMIT_GUESSES',
      ...payload,
    });
  };
}
