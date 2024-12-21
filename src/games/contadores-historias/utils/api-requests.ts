// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { PlayCardPayload, SubmitStoryPayload, SubmitVotePayload } from './types';
import { CONTADORES_HISTORIAS_ACTIONS } from './constants';

export function useOnSubmitStoryAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-story',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('História submetida com sucesso', 'Story submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua história',
      'Oops, the application found an error while trying to submit your story',
    ),
  });

  return (payload: SubmitStoryPayload) => {
    request({
      action: CONTADORES_HISTORIAS_ACTIONS.SUBMIT_STORY,
      ...payload,
    });
  };
}

export function useOnPlayCardAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'play-card',
    onError: () => setStep(1),
    successMessage: translate('Carta submetida com sucesso', 'Card submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card',
    ),
  });

  return (payload: PlayCardPayload) => {
    request({
      action: CONTADORES_HISTORIAS_ACTIONS.PLAY_CARD,
      ...payload,
    });
  };
}

export function useOnSubmitVoteAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-vote',
    onError: () => setStep(1),
    successMessage: translate('Voto submetido com sucesso', 'Vote submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your vote',
    ),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: CONTADORES_HISTORIAS_ACTIONS.SUBMIT_VOTE,
      ...payload,
    });
  };
}
