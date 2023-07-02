import { COMUNICACAO_ALIENIGENA_API, GAME_API } from 'services/adapters';
import { useAPICall } from 'hooks/useAPICall';
import { useLanguage } from 'hooks/useLanguage';

export function useOnSubmitAlienAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: COMUNICACAO_ALIENIGENA_API.submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitAlienPayload) => {
    request({
      action: 'SUBMIT_ALIEN',
      ...payload,
    });
  };
}

export function useOnSubmitSeedingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: COMUNICACAO_ALIENIGENA_API.submitAction,
    actionName: 'submit-seeds',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Análise submetida com sucesso', 'Analyses submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua análise',
      'Oops, the application found an error while trying to submit your analyses'
    ),
  });

  return (payload: SubmitSeedingPayload) => {
    request({
      action: 'SUBMIT_SEEDS',
      ...payload,
    });
  };
}

export function useOnSubmitHumanInquiryAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: COMUNICACAO_ALIENIGENA_API.submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitHumanInquiryPayload) => {
    request({
      action: 'SUBMIT_HUMAN_INQUIRY',
      ...payload,
    });
  };
}

export function useOnSubmitAlienResponseAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: COMUNICACAO_ALIENIGENA_API.submitAction,
    actionName: 'submit-action',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitAlienResponsePayload) => {
    request({
      action: 'SUBMIT_ALIEN_RESPONSE',
      ...payload,
    });
  };
}

export function useOnMakeReady() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: GAME_API.makePlayerReady,
    actionName: 'be-ready',
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar confirmar',
      'Oops, the application found an error while trying to confirm'
    ),
  });

  return request;
}

export function useOnSubmitAlienRequestAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: COMUNICACAO_ALIENIGENA_API.submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitAlienRequestPayload) => {
    request({
      action: 'SUBMIT_ALIEN_REQUEST',
      ...payload,
    });
  };
}

export function useOnSubmitOfferingAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: COMUNICACAO_ALIENIGENA_API.submitAction,
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate('Ação submetida com sucesso', 'Action submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação',
      'Oops, the application found an error while trying to submit your action'
    ),
  });

  return (payload: SubmitOfferingPayload) => {
    request({
      action: 'SUBMIT_OFFERING',
      ...payload,
    });
  };
}
