import { SONHOS_PESADELOS_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitDreamAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-dream',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('Sonho submetido com sucesso', 'Dream submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu sonho',
      'Oops, the application found an error while trying to submit your dream'
    ),
  });

  return (payload: SubmitDreamPayload) => {
    request({
      action: 'SUBMIT_DREAM',
      ...payload,
    });
  };
}

export function useOnSubmitVotesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: SONHOS_PESADELOS_API.submitAction,
    actionName: 'submit-votes',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Votos submetidos com sucesso', 'Votes submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos',
      'Oops, the application found an error while trying to submit your votes'
    ),
  });

  return (payload: SubmitVotesPayload) => {
    request({
      action: 'SUBMIT_VOTING',
      ...payload,
    });
  };
}
