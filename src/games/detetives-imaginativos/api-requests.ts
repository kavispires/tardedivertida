import { DETETIVES_IMAGINATIVOS_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitSecretClueAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-secret-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate(
      'Pista Secreta submetida com sucesso',
      'Secret clue submitted successfully',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pista secreta',
      'Oops, the application found an error while trying to submit your secret clue',
      language
    ),
  });

  return (payload: SubmitSecretCluePayload) => {
    request({
      action: 'SUBMIT_CLUE',
      ...payload,
    });
  };
}

export function useOnPlayCardAPIRequest() {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'play-card',
    successMessage: translate('Carta enviada com sucesso', 'Card submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card',
      language
    ),
  });

  return (payload: SubmitPlayCardPayload) => {
    request({
      action: 'PLAY_CARD',
      ...payload,
    });
  };
}

export function useOnFinishDefenseRequest() {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'finish-defense',
    successMessage: translate('Defesa concluída com sucesso', 'Defense concluded successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar concluir sua defesa',
      'Oops, the application found an error while trying to conclude your defense',
      language
    ),
  });

  return () => {
    request({
      action: 'DEFEND',
    });
  };
}

export function useOnSubmitVoteAPIRequest() {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-vote',
    successMessage: translate('Voto enviado com sucesso', 'Vote submitted successfully', language),
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
