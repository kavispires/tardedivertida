// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import { useOnMakeMeReady } from '@hooks/useMakeMeReady';
import type { UseStep } from '@hooks/useStep';
// Internal
import type { SubmitDoorPayload, SubmitPagesPayload } from './types';
import { PORTA_DOS_DESESPERADOS_ACTIONS } from './constants';

export function useOnSubmitPagesAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-pages',
    onBeforeCall: () => setStep(4),
    onError: () => setStep(2),
    successMessage: translate({ pt: 'Cartas enviadas com sucesso', en: 'Cards submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      en: 'Oops, the application failed to send your card',
    }),
  });

  return (payload: SubmitPagesPayload) => {
    request({
      action: PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_PAGES,
      ...payload,
    });
  };
}

export function useOnSubmitDoorAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-door',
    successMessage: translate({ pt: 'Porta enviada com sucesso', en: 'Door submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua porta',
      en: 'Oops, the application failed to send your door',
    }),
  });

  return (payload: SubmitDoorPayload) => {
    request({
      action: PORTA_DOS_DESESPERADOS_ACTIONS.SUBMIT_DOOR,
      ...payload,
    });
  };
}

export function useOnMakeReady(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  return useOnMakeMeReady({
    onSuccess: () => setStep(3),
    successMessage: translate({
      pt: 'Pronto! Aguarde os outros jogadores estarem prontos',
      en: 'Done! Now wait for the other players',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar confirmar sua porta',
      en: 'Oops, the application failed to confirm your door',
    }),
  });
}
