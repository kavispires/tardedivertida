import { SONHOS_PESADELOS_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitDreamsAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-dreams',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Sonhos submetidos com sucesso', 'Dreams submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus sonhos',
      'Oops, the application found an error while trying to submit your dreams',
      language
    ),
  });

  return (payload: SubmitDreamsPayload) => {
    request({
      action: 'SUBMIT_DREAMS',
      ...payload,
    });
  };
}

export function useOnSubmitVotesAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Votos submetidos com sucesso', 'Votes submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
      'Oops, the application found an error while trying to submit your votes',
      language
    ),
  });

  return (payload: SubmitVotesPayload) => {
    request({
      action: 'SUBMIT_VOTING',
      ...payload,
    });
  };
}