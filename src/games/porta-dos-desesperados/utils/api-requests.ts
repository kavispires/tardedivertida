import { GAME_API, PORTA_DOS_DESESPERADOS } from 'services/adapters';
// Hooks
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitPagesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: PORTA_DOS_DESESPERADOS.submitAction,
    actionName: 'submit-word',
    onBeforeCall: () => setStep(4),
    onError: () => setStep(2),
    successMessage: translate('Cartas enviadas com sucesso', 'Cards submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application failed to send your card'
    ),
  });

  return (payload: SubmitPagesPayload) => {
    request({
      action: 'SUBMIT_PAGES',
      ...payload,
    });
  };
}

export function useOnSubmitDoorAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: PORTA_DOS_DESESPERADOS.submitAction,
    actionName: 'submit-word',
    successMessage: translate('Porta enviada com sucesso', 'Door submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua porta',
      'Oops, the application failed to send your door'
    ),
  });

  return (payload: SubmitDoorPayload) => {
    request({
      action: 'SUBMIT_DOOR',
      ...payload,
    });
  };
}

export function useOnMakeReady(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    onSuccess: () => setStep(3),
    successMessage: translate(
      'Pronto! Aguarde os outros jogadores estarem prontos',
      'Done! Now wait for the other players'
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar confirmar sua porta',
      'Oops, the application failed to confirm your door'
    ),
  });

  return request;
}
