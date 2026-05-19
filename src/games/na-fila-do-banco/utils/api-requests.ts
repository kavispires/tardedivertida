// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import type { SubmitPlayCardPayload } from './types';
import { NA_FILA_DO_BANCO_ACTIONS } from './constants';

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

  return (payload: SubmitPlayCardPayload) => {
    request({
      action: NA_FILA_DO_BANCO_ACTIONS.PLAY_CARD,
      ...payload,
    });
  };
}
