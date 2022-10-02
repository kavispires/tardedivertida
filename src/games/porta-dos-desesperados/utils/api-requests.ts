import { PORTA_DOS_DESESPERADOS } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitPagesAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: PORTA_DOS_DESESPERADOS.submitAction,
    actionName: 'submit-word',
    onBeforeCall: () => setStep(3),
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
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
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
