import type { SubmitActionPayload } from './types';

import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';

import type { UseStep } from 'hooks/useStep';

export function useOnSubmitVotingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitActionPayload) => {
    request({
      action: 'SUBMIT_ACTION',
      ...payload,
    });
  };
}
