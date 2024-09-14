// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
// Internal
import { TESTEMUNHA_OCULAR_ACTIONS } from './constants';


export function useOnSelectWitnessAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'select-witness',
    successMessage: translate('Testemunha enviada com sucesso', 'Witness submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar selecionar a testemunha',
      'Oops, the application found an error while trying to submit the witness'
    ),
  });

  return (payload: SelectWitnessPayload) => {
    request({
      action: TESTEMUNHA_OCULAR_ACTIONS.SELECT_WITNESS,
      ...payload,
    });
  };
}

export function useOnSelectQuestionAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'select-question',
    successMessage: translate('Pergunta enviada com sucesso', 'Question submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar pergunta',
      'Oops, the application found an error while trying to submit question'
    ),
  });

  return (payload: SelectQuestionPayload) => {
    request({
      action: TESTEMUNHA_OCULAR_ACTIONS.SELECT_QUESTION,
      ...payload,
    });
  };
}

export function useOnSubmitTestimonyAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-testimony',
    successMessage: translate('Testemunho enviada com sucesso', 'Testimony submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu testemunho',
      'Oops, the application found an error while trying to send your testimony'
    ),
  });

  return (payload: SubmitTestimonyPayload) => {
    request({
      action: TESTEMUNHA_OCULAR_ACTIONS.GIVE_TESTIMONY,
      ...payload,
    });
  };
}

export function useOnEliminateSuspectAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'eliminate-suspect',
    successMessage: translate('Suspeito eliminado com sucesso', 'Suspect release submitted successfully'),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar eliminar o suspeito',
      'Oops, the application found an error while trying to release the suspect'
    ),
  });

  return (payload: EliminatePayload) => {
    request({
      action: TESTEMUNHA_OCULAR_ACTIONS.ELIMINATE_SUSPECT,
      ...payload,
    });
  };
}
