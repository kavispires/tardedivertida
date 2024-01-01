import type { PlayCardPayload, SubmitStoryPayload, SubmitVotePayload } from './types';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'contadoresHistoriasSubmitAction');

export function useOnSubmitStoryAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-story',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('História submetida com sucesso', 'Story submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua história',
      'Oops, the application found an error while trying to submit your story'
    ),
  });

  return (payload: SubmitStoryPayload) => {
    request({
      action: 'SUBMIT_STORY',
      ...payload,
    });
  };
}

export function useOnPlayCardAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'play-card',
    onError: () => setStep(1),
    successMessage: translate('Carta submetida com sucesso', 'Card submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card'
    ),
  });

  return (payload: PlayCardPayload) => {
    request({
      action: 'PLAY_CARD',
      ...payload,
    });
  };
}

export function useOnSubmitVoteAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-vote',
    onError: () => setStep(1),
    successMessage: translate('Voto submetido com sucesso', 'Vote submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your vote'
    ),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: 'SUBMIT_VOTE',
      ...payload,
    });
  };
}
