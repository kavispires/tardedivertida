// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import type { SubmitCardPlayPayload } from './types';
import { ESCAPE_ROOM_ACTIONS } from './constants';

export function useOnSubmitCardPlay() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-card-play',
    successMessage: translate('Carta submetida com sucesso', 'Card submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card',
    ),
  });

  return (payload: SubmitCardPlayPayload) => {
    request({
      action: ESCAPE_ROOM_ACTIONS.SUBMIT_CARD_PLAY,
      ...payload,
    });
  };
}
