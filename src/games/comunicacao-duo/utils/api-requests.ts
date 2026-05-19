// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import type { SubmitDeliveryPayload, SubmitRequestPayload } from './types';
import { COMUNICACAO_DUO_ACTIONS } from './constants';

export function useOnSubmitRequestAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-request',
    successMessage: translate({ pt: 'Ação submetida com sucesso', en: 'Action submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitRequestPayload) => {
    request({
      action: COMUNICACAO_DUO_ACTIONS.SUBMIT_REQUEST,
      ...payload,
    });
  };
}

export function useOnSubmitDeliveryAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-delivery',
    successMessage: translate({ pt: 'Ação submetida com sucesso', en: 'Action submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitDeliveryPayload) => {
    request({
      action: COMUNICACAO_DUO_ACTIONS.SUBMIT_DELIVERY,
      ...payload,
    });
  };
}

export function useOnStopDeliveryAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'stop-delivery',

    successMessage: translate({ pt: 'Ação submetida com sucesso', en: 'Action submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return () => {
    request({
      action: COMUNICACAO_DUO_ACTIONS.STOP_DELIVERY,
    });
  };
}
