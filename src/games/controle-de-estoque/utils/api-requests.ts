// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import { useOnMakeMeReady } from 'hooks/useMakeMeReady';
// Internal
import type { PlaceGoodPayload } from './types';
import { CONTROLE_DE_ESTOQUE_ACTIONS } from './constants';

export function useOnMakeReady() {
  const { translate } = useLanguage();

  return useOnMakeMeReady({
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players',
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar confirmar sua prontidão',
      'Oops, the application failed to confirm your readiness',
    ),
  });
}

export function useOnPlaceGoodAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-place-good',
    successMessage: translate('Produto colocado com sucesso', 'Good placed successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
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
    successMessage: translate(
      'Localização do produto confirmada com sucesso',
      'Product location confirmed successfully',
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar confirmar a localização do produto',
      'Oops, the application found an error while trying to confirm the product location',
    ),
  });

  return (payload: PlaceGoodPayload) => {
    request({
      action: CONTROLE_DE_ESTOQUE_ACTIONS.CONFIRM_PLACEMENT,
      ...payload,
    });
  };
}
