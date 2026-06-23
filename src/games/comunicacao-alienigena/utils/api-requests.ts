// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import { COMUNICACAO_ALIENIGENA_ACTIONS } from './constants';
import type {
  SubmitAlienPayload,
  SubmitAlienRequestPayload,
  SubmitAlienResponsesPayload,
  SubmitHumanInquiryPayload,
  SubmitNotesConfirmationPayload,
  SubmitOfferingsPayload,
  SubmitSeedingPayload,
} from './types';

export function useOnSubmitAlienAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-alien',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Escolha do alienígena submetida com sucesso',
      en: 'Alien player submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a escolha do alienígena',
      en: 'Oops, the application found an error while trying to submit the alien player',
    }),
  });

  return (payload: SubmitAlienPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN,
      ...payload,
    });
  };
}

export function useOnSubmitSeedingAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-seeds',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Análise submetida com sucesso', en: 'Analyses submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua análise',
      en: 'Oops, the application found an error while trying to submit your analyses',
    }),
  });

  return (payload: SubmitSeedingPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_SEEDS,
      ...payload,
    });
  };
}

export function useOnSubmitHumanInquiryAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-action',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Pergunta submetida com sucesso', en: 'Inquiry submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pergunta',
      en: 'Oops, the application found an error while trying to submit your inquiry',
    }),
  });

  return (payload: SubmitHumanInquiryPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_HUMAN_INQUIRY,
      ...payload,
    });
  };
}

export function useOnSubmitAlienResponseAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-alien-responses',
    successMessage: translate({
      pt: 'Símbolos submetidos com sucesso',
      en: 'Symbols submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar os símbolos',
      en: 'Oops, the application found an error while trying to submit the symbols',
    }),
  });

  return (payload: SubmitAlienResponsesPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_RESPONSES,
      ...payload,
    });
  };
}

export function useOnSubmitNotesConfirmationAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-notes-confirmation',
    successMessage: translate({
      pt: 'Confirmação submetida com sucesso',
      en: 'Notes confirmed successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar a confirmação',
      en: 'Oops, the application found an error while trying to submit the confirmation',
    }),
  });

  return (payload: SubmitNotesConfirmationPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.CONFIRM_NOTES,
      ...payload,
    });
  };
}

export function useOnSubmitAlienRequestAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-alien-request',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({ pt: 'Pedido submetido com sucesso', en: 'Request submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu pedido',
      en: 'Oops, the application found an error while trying to submit your request',
    }),
  });

  return (payload: SubmitAlienRequestPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_ALIEN_REQUEST,
      ...payload,
    });
  };
}

export function useOnSubmitOfferingsAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-offerings',
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Ofertas submetidas com sucesso',
      en: 'Offerings submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar suas ofertas',
      en: 'Oops, the application found an error while trying to submit your offerings',
    }),
  });

  return (payload: SubmitOfferingsPayload) => {
    request({
      action: COMUNICACAO_ALIENIGENA_ACTIONS.SUBMIT_OFFERINGS,
      ...payload,
    });
  };
}
