import type { SubmitMovieActorPayload, SubmitMovieGenrePayload } from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'testeDeElencoSubmitAction');

export function useOnSubmitMovieGenreAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-genre',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Gênero submetido com sucesso', 'Genre submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitMovieGenrePayload) => {
    request({
      action: 'SELECT_MOVIE_GENRE',
      ...payload,
    });
  };
}

export function useOnSubmitMovieActorAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-genre',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ator submetido com sucesso', 'Actor submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitMovieActorPayload) => {
    request({
      action: 'SELECT_ACTOR',
      ...payload,
    });
  };
}
