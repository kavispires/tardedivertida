import { POLEMICA_DA_VEZ_API } from '../../adapters';
import { translate } from '../../components';
import { useAPICall, useLanguage } from '../../hooks';

export function useOnSubmitTopicAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: POLEMICA_DA_VEZ_API.submitAction,
    actionName: 'submit-topic',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(2),
    successMessage: translate('Assunto enviada com sucesso!', 'Topic send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu assunto',
      'Oops, the application failed to submit the topic',
      language
    ),
  });

  return (payload: SubmitTopicPayload) => {
    request({
      action: 'SUBMIT_TOPIC',
      ...payload,
    });
  };
}

export function useOnSubmitReactionAPIRequest(setStep: GenericFunction) {
  const language = useLanguage();

  const request = useAPICall({
    apiFunction: POLEMICA_DA_VEZ_API.submitAction,
    actionName: 'submit-reaction',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(1),
    successMessage: translate('Reação enviada com sucesso!', 'Reaction send successfully!', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua reação',
      'Oops, the application failed to submit your reaction',
      language
    ),
  });

  return (payload: SubmitReactionPayload) => {
    request({
      action: 'SUBMIT_REACTION',
      ...payload,
    });
  };
}