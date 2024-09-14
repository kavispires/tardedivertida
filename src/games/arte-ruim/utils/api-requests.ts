// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitDrawingPayload, SubmitVotingPayload } from './types';
import { ARTE_RUIM_ACTIONS } from './constants';


export function useOnSubmitDrawingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(2),
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
      action: ARTE_RUIM_ACTIONS.SUBMIT_DRAWING,
      ...payload,
    });
  };
}

export function useOnSubmitVotingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-voting',
    onSuccess: () => setStep(2),
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
      action: ARTE_RUIM_ACTIONS.SUBMIT_VOTING,
      ...payload,
    });
  };
}
