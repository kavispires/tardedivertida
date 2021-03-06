import { ARTE_RUIM_API } from 'services/adapters';
import { useAPICall, useLanguage } from 'hooks';

export function useOnSubmitDrawingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ARTE_RUIM_API.submitAction,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate(
      'Acabou o tempo! Aguarde enquanto os outros participantes desenham',
      "Time's up! Wait for the other players to finish their art"
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
      'Oops, the application failed to send your art'
    ),
  });

  return (payload: SubmitDrawingPayload) => {
    request({
      action: 'SUBMIT_DRAWING',
      ...payload,
    });
  };
}

export function useOnSubmitVotingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ARTE_RUIM_API.submitAction,
    actionName: 'submit-voting',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      'Avaliação enviada! Agora aguarde os outros jogadores',
      'Evaluation sent successfully! Wait for the other players'
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua avaliação',
      'Oops, the application failed to send your evaluation'
    ),
  });

  return (payload: SubmitVotingPayload) => {
    request({
      action: 'SUBMIT_VOTING',
      ...payload,
    });
  };
}
