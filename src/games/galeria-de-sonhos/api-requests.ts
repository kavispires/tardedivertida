import { GALERIA_DE_SONHOS_API } from 'services/adapters';
import { useAPICall, useLanguage } from 'hooks';

export function useOnSubmitWordAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: GALERIA_DE_SONHOS_API.submitAction,
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
      action: 'SUBMIT_WORD',
      ...payload,
    });
  };
}

export function useOnSubmitCardsAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: GALERIA_DE_SONHOS_API.submitAction,
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
      action: 'SUBMIT_CARDS',
      ...payload,
    });
  };
}

export function useOnPlayCardAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: GALERIA_DE_SONHOS_API.submitAction,
    actionName: 'play-card',
    // onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Carta enviada com sucesso', 'Card submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application failed to send your card'
    ),
  });

  return (payload: PlayCardPayload) => {
    request({
      action: 'PLAY_CARD',
      ...payload,
    });
  };
}
