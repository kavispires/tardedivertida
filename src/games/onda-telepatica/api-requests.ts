import { ONDA_TELEPATICA_API } from 'services/adapters';

import { useAPICall, useLanguage } from 'hooks';

export function useOnSubmitCategoryAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-category',
    successMessage: translate('Categoria enviada com sucesso!', 'Category submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria',
      'Oops, the application failed to submit the category'
    ),
  });

  return (payload: SubmitCategoryPayload) => {
    request({
      action: 'SUBMIT_CATEGORY',
      ...payload,
    });
  };
}

export function useOnSubmitClueAPIRequest() {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-category',
    successMessage: translate('Categoria enviada com sucesso!', 'Category submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria',
      'Oops, the application failed to submit the category'
    ),
  });

  return (payload: SubmitCluePayload) => {
    request({
      action: 'SUBMIT_CLUE',
      ...payload,
    });
  };
}

export function useOnSubmitGuessAPIRequest(setStep: GenericFunction) {
  const { translate } = useLanguage();

  const request = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Resposta enviado com sucesso!', 'Guess submitted successfully!'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta',
      'Oops, the application failed to submit your guess'
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: 'SUBMIT_GUESS',
      ...payload,
    });
  };
}
