import { CONTADORES_HISTORIAS_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitStoryAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'submit-story',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate('História submetida com sucesso', 'Story submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua história',
      'Oops, the application found an error while trying to submit your story',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'play-card',
    onError: () => setStep(1),
    successMessage: translate('Carta submetida com sucesso', 'Card submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: CONTADORES_HISTORIAS_API.submitAction,
    actionName: 'submit-vote',
    onError: () => setStep(1),
    successMessage: translate('Voto submetido com sucesso', 'Vote submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your vote',
      language
    ),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: 'SUBMIT_VOTE',
      ...payload,
    });
  };
}