// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitDecisionPayload, SubmitMessagePayload, SubmitTargetPayload } from './types';
import { QUEM_NAO_MATA_ACTIONS } from './constants';

export function useOnSubmitTargetAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-target',
    successMessage: translate({ pt: 'Alvo selecionado com sucesso', en: 'Target set successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu alvo',
      en: 'Oops, the application failed to send your target',
    }),
  });

  return (payload: SubmitTargetPayload) => {
    request({
      action: QUEM_NAO_MATA_ACTIONS.SUBMIT_TARGET,
      ...payload,
    });
  };
}

export function useOnSubmitMessageAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-message',
    successMessage: translate({ pt: 'Mensagem enviada com sucesso!', en: 'Message sent successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a mensagem',
      en: 'Oops, the application failed to send the message',
    }),
  });

  return (payload: SubmitMessagePayload) => {
    request({
      action: QUEM_NAO_MATA_ACTIONS.SUBMIT_MESSAGE,
      ...payload,
    });
  };
}

export function useOnSubmitDecisionAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-decision',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate({ pt: 'Decisão enviada com sucesso!', en: 'Decision sent successfully!' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a sua decisão',
      en: 'Oops, the application failed to send your decision',
    }),
  });

  return (payload: SubmitDecisionPayload) => {
    request({
      action: QUEM_NAO_MATA_ACTIONS.SUBMIT_DECISION,
      ...payload,
    });
  };
}
