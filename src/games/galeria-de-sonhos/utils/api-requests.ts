import type { PlayCardPayload, SubmitCardsPayload, SubmitWordPayload } from './types';
import type { UseStep } from 'hooks/useStep';

import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';

import { GALERIA_DE_SONHOS_ACTIONS } from './constants';

export function useOnSubmitWordAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-word',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Palavra enviada com sucesso', 'Word submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua palavra',
      'Oops, the application failed to send your word'
    ),
  });

  return (payload: SubmitWordPayload) => {
    request({
      action: GALERIA_DE_SONHOS_ACTIONS.SUBMIT_WORD,
      ...payload,
    });
  };
}

export function useOnSubmitCardsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-cards',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Cartas enviadas com sucesso', 'Cards submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar suas cartas',
      'Oops, the application failed to send your cards'
    ),
  });

  return (payload: SubmitCardsPayload) => {
    request({
      action: GALERIA_DE_SONHOS_ACTIONS.SUBMIT_CARDS,
      ...payload,
    });
  };
}

export function useOnPlayCardAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'play-card',
    onError: () => setStep(2),
    successMessage: translate('Carta enviada com sucesso', 'Card submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application failed to send your card'
    ),
  });

  return (payload: PlayCardPayload) => {
    request({
      action: GALERIA_DE_SONHOS_ACTIONS.PLAY_CARD,
      ...payload,
    });
  };
}
