import { VAMOS_AO_CINEMA_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitMovieSelectionAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: VAMOS_AO_CINEMA_API.submitAction,
    actionName: 'submit-action',

    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitMovieSelectionPayload) => {
    request({
      action: 'SELECT_MOVIE',
      ...payload,
    });
  };
}

export function useOnSubmitMovieEliminationAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: VAMOS_AO_CINEMA_API.submitAction,
    actionName: 'submit-action',
    onBeforeCall: () =>
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      }),
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitMovieEliminationPayload) => {
    request({
      action: 'ELIMINATE_MOVIE',
      ...payload,
    });
  };
}

export function useOnSubmitMoviePosterAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: VAMOS_AO_CINEMA_API.submitAction,
    actionName: 'submit-action',
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitMovieEliminationPayload) => {
    request({
      action: 'VOTE_FOR_POSTER',
      ...payload,
    });
  };
}
