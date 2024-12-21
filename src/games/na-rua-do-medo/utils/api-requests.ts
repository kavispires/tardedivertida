// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import { NA_RUA_DO_MEDO_ACTIONS } from './constants';
import type { SubmitDecisionPayload } from './types';

export function useOnSubmitDecisionAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-decision',
    onSuccess: () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    },
    successMessage: translate('Decisão submetida com sucesso', 'Decision submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua decisão',
      'Oops, the application found an error while trying to submit your decision',
    ),
  });

  return (payload: SubmitDecisionPayload) => {
    request({
      action: NA_RUA_DO_MEDO_ACTIONS.SUBMIT_DECISION,
      ...payload,
    });
  };
}
