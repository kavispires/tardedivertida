import { LABIRINTO_SECRETO_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitMapAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: LABIRINTO_SECRETO_API.submitAction,
    actionName: 'submit-map',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Mapa submetido com sucesso', 'Map submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu mapa',
      'Oops, the application found an error while trying to submit your map'
    ),
  });

  return (payload: SubmitMapPayload) => {
    request({
      action: 'SUBMIT_MAP',
      ...payload,
    });
  };
}

export function useOnSubmitPathAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: LABIRINTO_SECRETO_API.submitAction,
    actionName: 'submit-path',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Caminho submetido com sucesso', 'Path submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu caminho',
      'Oops, the application found an error while trying to submit your path'
    ),
  });

  return (payload: SubmitPathGuessPayload) => {
    request({
      action: 'SUBMIT_PATH',
      ...payload,
    });
  };
}
