// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type { SubmitDeclarationPayload, SubmitTargetPayload, UpdateTargetPlayerPayload } from './types';
import { BOMBA_RELOGIO_ACTIONS } from './constants';

export function useOnSubmitDeclarationAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-declaration',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Declaração submetida com sucesso', 'Declaration submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua declaração',
      'Oops, the application found an error while trying to submit your declaration',
    ),
  });

  return (payload: SubmitDeclarationPayload) => {
    request({
      action: BOMBA_RELOGIO_ACTIONS.SUBMIT_DECLARATION,
      ...payload,
    });
  };
}

export function useOnUpdateTargetPlayerAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'update-target-player',
    // onSuccess: () => setStep(1),
    // onError: () => setStep(0),
    successMessage: translate('Jogador alvo atualizado com sucesso', 'Target player updated successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar atualizar o jogador alvo',
      'Oops, the application found an error while trying to update the target player',
    ),
  });

  return (payload: UpdateTargetPlayerPayload) => {
    request({
      action: BOMBA_RELOGIO_ACTIONS.UPDATE_TARGET_PLAYER,
      ...payload,
    });
  };
}

export function useOnSubmitTargetAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-target',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Alvo submetido com sucesso', 'Target submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu alvo',
      'Oops, the application found an error while trying to submit your target',
    ),
  });

  return (payload: SubmitTargetPayload) => {
    request({
      action: BOMBA_RELOGIO_ACTIONS.SUBMIT_TARGET,
      ...payload,
    });
  };
}
