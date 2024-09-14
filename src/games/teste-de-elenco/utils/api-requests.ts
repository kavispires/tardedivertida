// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitMovieActorPayload, SubmitMovieGenrePayload } from './types';
import { TESTE_DE_ELENCO_ACTIONS } from './constants';



export function useOnSubmitMovieGenreAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
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
      action: TESTE_DE_ELENCO_ACTIONS.SELECT_MOVIE_GENRE,
      ...payload,
    });
  };
}

export function useOnSubmitMovieActorAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
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
      action: TESTE_DE_ELENCO_ACTIONS.SELECT_ACTOR,
      ...payload,
    });
  };
}
