import type { SubmitOrientationPayload, SubmitSketchPayload, SubmitVotePayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'retratoFaladoSubmitAction');

export function useOnSubmitOrientationAPIRequest(setStep: UseStep['setStep']) {
  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-sketch',
    onBeforeCall: () => setStep(3),
  });

  return (payload: SubmitOrientationPayload) => {
    request({
      action: 'SUBMIT_ORIENTATION',
      ...payload,
    });
  };
}

export function useOnSubmitSketchAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-sketch',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(1),
    successMessage: translate(
      'Acabou o tempo! Desenho enviado com sucesso',
      "Time's up! Sketch submitted successfully"
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar o desenho',
      'Oops, the application failed to send your sketch'
    ),
  });

  return (payload: SubmitSketchPayload) => {
    request({
      action: 'SUBMIT_SKETCH',
      ...payload,
    });
  };
}

export function useOnSubmitVoteAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-vote',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Voto enviado com sucesso', 'Vote submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application failed to send your vote'
    ),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: 'SUBMIT_VOTE',
      ...payload,
    });
  };
}
