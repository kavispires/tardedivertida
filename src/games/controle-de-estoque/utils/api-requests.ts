// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import { useOnMakeMeReady } from '@hooks/useMakeMeReady';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { PlaceGoodPayload, SubmitFulfillmentPayload } from './types';
import { CONTROLE_DE_ESTOQUE_ACTIONS } from './constants';

export function useOnMakeReady() {
  const { translate } = useLanguage();

  return useOnMakeMeReady({
    successMessage: translate({
      pt: 'Pronto! Aguarde os outros jogadores estarem prontos',
      en: 'Done! Now wait for the other players',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar confirmar sua prontidão',
      en: 'Oops, the application failed to confirm your readiness',
    }),
  });
}

export function useOnPlaceGoodAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-place-good',
    successMessage: translate({ pt: 'Produto colocado com sucesso', en: 'Good placed successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: PlaceGoodPayload) => {
    request({
      action: CONTROLE_DE_ESTOQUE_ACTIONS.PLACE_GOOD,
      ...payload,
    });
  };
}

export function useOnConfirmGoodPlacementAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-confirm-placement',
    successMessage: translate({
      pt: 'Localização do produto confirmada com sucesso',
      en: 'Product location confirmed successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar confirmar a localização do produto',
      en: 'Oops, the application found an error while trying to confirm the product location',
    }),
  });

  return (payload: PlaceGoodPayload) => {
    request({
      action: CONTROLE_DE_ESTOQUE_ACTIONS.CONFIRM_PLACEMENT,
      ...payload,
    });
  };
}

export function useOnSubmitFulfillmentAPIRequest(goToNextStep: UseStep['goToNextStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-fulfill-orders',
    onSuccess: () => goToNextStep(),
    successMessage: translate({
      pt: 'Ordem de pedido enviada com sucesso',
      en: 'Order fulfillment submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ordem de pedido',
      en: 'Oops, the application found an error while trying to submit your order fulfillment',
    }),
  });

  return (payload: SubmitFulfillmentPayload) => {
    request({
      action: CONTROLE_DE_ESTOQUE_ACTIONS.SUBMIT_FULFILL_ORDERS,
      ...payload,
    });
  };
}
