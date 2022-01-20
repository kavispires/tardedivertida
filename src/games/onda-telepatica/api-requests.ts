import { ONDA_TELEPATICA_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitCategoryAPIRequest() {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-category',
    successMessage: translate('Categoria enviada com sucesso!', 'Category submitted successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria',
      'Oops, the application failed to submit the category',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-category',
    successMessage: translate('Categoria enviada com sucesso!', 'Category submitted successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar a categoria',
      'Oops, the application failed to submit the category',
      language
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
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: ONDA_TELEPATICA_API.submitAction,
    actionName: 'submit-guess',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Resposta enviado com sucesso!', 'Guess submitted successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua resposta',
      'Oops, the application failed to submit your guess',
      language
    ),
  });

  return (payload: SubmitGuessPayload) => {
    request({
      action: 'SUBMIT_GUESS',
      ...payload,
    });
  };
}
