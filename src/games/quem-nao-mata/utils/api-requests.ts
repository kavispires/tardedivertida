import type { SubmitDecisionPayload, SubmitMessagePayload, SubmitTargetPayload } from './types';
import type { UseStep } from 'hooks/useStep';
import { functions } from 'services/firebase';
import { httpsCallable } from 'firebase/functions';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

const submitAction = httpsCallable(functions, 'quemNaoMataSubmitAction');

export function useOnSubmitTargetAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-target',
    successMessage: translate('Alvo selecionado com sucesso', 'Target set successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu alvo',
      'Oops, the application failed to send your target'
    ),
  });

  return (payload: SubmitTargetPayload) => {
    request({
      action: 'SUBMIT_TARGET',
      ...payload,
    });
  };
}

export function useOnSubmitMessageAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-message',
    successMessage: translate('Mensagem enviada com sucesso!', 'Message sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a mensagem',
      'Oops, the application failed to send the message'
    ),
  });

  return (payload: SubmitMessagePayload) => {
    request({
      action: 'SUBMIT_MESSAGE',
      ...payload,
    });
  };
}

export function useOnSubmitDecisionAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: submitAction,
    actionName: 'submit-decision',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Decisão enviada com sucesso!', 'Decision sent successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a sua decisão',
      'Oops, the application failed to send your decision'
    ),
  });

  return (payload: SubmitDecisionPayload) => {
    request({
      action: 'SUBMIT_DECISION',
      ...payload,
    });
  };
}
