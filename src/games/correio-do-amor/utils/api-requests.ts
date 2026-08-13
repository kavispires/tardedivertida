// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
// Internal
import type { SubmitCardPayload, SubmitSelectionsPayload } from './types';
import { CORREIO_DO_AMOR_ACTIONS } from './constants';

export function useOnSubmitCardAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-card',
    successMessage: translate({ pt: 'Carta submetida com sucesso', en: 'Card submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      en: 'Oops, the application found an error while trying to submit your card',
    }),
  });

  return (payload: SubmitCardPayload) => {
    request({
      action: CORREIO_DO_AMOR_ACTIONS.SUBMIT_CARD,
      ...payload,
    });
  };
}

export function useOnSubmitSelectionsAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-selections',
    successMessage: translate({ pt: 'Ação submetida com sucesso', en: 'Action submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      en: 'Oops, the application found an error while trying to submit your action',
    }),
  });

  return (payload: SubmitSelectionsPayload) => {
    request({
      action: CORREIO_DO_AMOR_ACTIONS.SUBMIT_SELECTIONS,
      ...payload,
    });
  };
}
