import { CRUZA_PALAVRAS_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitClueAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CRUZA_PALAVRAS_API.submitAction,
    actionName: 'submit-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate('Dica enviada com sucesso', 'Clue submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua dica',
      'Oops, the application failed to send your clue',
      language
    ),
  });

  return (payload: SubmitCluePayload) => {
    request({
      action: 'SUBMIT_CLUE',
      ...payload,
    });
  };
}

export function useOnSubmitGuessesAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CRUZA_PALAVRAS_API.submitAction,
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
