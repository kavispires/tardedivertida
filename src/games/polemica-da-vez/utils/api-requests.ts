import type { SubmitReactionPayload, SubmitTweetPayload } from './types';
import type { UseStep } from 'hooks/useStep';

import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';

import { POLEMICA_DA_VEZ_ACTIONS } from './constants';

export function useOnSubmitTweetAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-tweet',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Assunto enviada com sucesso!', 'Tweet send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu assunto',
      'Oops, the application failed to submit the tweet'
    ),
  });

  return (payload: SubmitTweetPayload) => {
    request({
      action: POLEMICA_DA_VEZ_ACTIONS.SUBMIT_TOPIC,
      ...payload,
    });
  };
}

export function useOnSubmitReactionAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-reaction',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Reação enviada com sucesso!', 'Reaction send successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua reação',
      'Oops, the application failed to submit your reaction'
    ),
  });

  return (payload: SubmitReactionPayload) => {
    request({
      action: POLEMICA_DA_VEZ_ACTIONS.SUBMIT_REACTION,
      ...payload,
    });
  };
}
