import { useAPICall, useLanguage } from 'hooks';
import { QUEM_NAO_MATA_API } from 'services/adapters';

export function useOnSubmitTargetAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: QUEM_NAO_MATA_API.submitAction,
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
    apiFunction: QUEM_NAO_MATA_API.submitAction,
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

export function useOnSubmitDecisionAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: QUEM_NAO_MATA_API.submitAction,
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
