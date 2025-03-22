// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type {
  SubmitAssociatedSocialGroupPayload,
  SubmitDetectiveLocationPayload,
  SubmitIntimidationPayload,
  SubmitPlayersRoles,
} from './types';
import { FOFOCA_QUENTE_ACTIONS } from './constants';

export function useOnSubmitPlayersRolesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-player-roles',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitPlayersRoles) => {
    request({
      action: FOFOCA_QUENTE_ACTIONS.SUBMIT_PLAYERS_ROLES,
      ...payload,
    });
  };
}

export function useOnSubmitSocialGroupAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-social-group',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });
  return (payload: SubmitAssociatedSocialGroupPayload) => {
    request({
      action: FOFOCA_QUENTE_ACTIONS.SUBMIT_SOCIAL_GROUP,
      ...payload,
    });
  };
}

export function useOnUpdateDetectiveLocationAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'update-detective-location',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitDetectiveLocationPayload) => {
    request({
      action: FOFOCA_QUENTE_ACTIONS.UPDATE_DETECTIVE_POSITION,
      ...payload,
    });
  };
}

export function useOnSubmitIntimidationAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-intimidation',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action',
    ),
  });

  return (payload: SubmitIntimidationPayload) => {
    request({
      action: FOFOCA_QUENTE_ACTIONS.SUBMIT_INTIMIDATION,
      ...payload,
    });
  };
}
