// Hooks
import { useGameActionRequest } from '@hooks/useGameActionRequest';
import { useLanguage } from '@hooks/useLanguage';
import type { UseStep } from '@hooks/useStep';
// Internal
import { TESTEMUNHA_OCULAR_ACTIONS } from './constants';
import type {
  EliminatePayload,
  FinalEliminationPayload,
  SelectQuestionPayload,
  SelectWitnessPayload,
  SubmitTestimonyPayload,
} from './types';

export function useOnSelectWitnessAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'select-witness',
    successMessage: translate({ pt: 'Testemunha enviada com sucesso', en: 'Witness submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar selecionar a testemunha',
      en: 'Oops, the application found an error while trying to submit the witness',
    }),
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
    successMessage: translate({ pt: 'Pergunta enviada com sucesso', en: 'Question submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar pergunta',
      en: 'Oops, the application found an error while trying to submit question',
    }),
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
    successMessage: translate({
      pt: 'Testemunho enviada com sucesso',
      en: 'Testimony submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu testemunho',
      en: 'Oops, the application found an error while trying to send your testimony',
    }),
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
    successMessage: translate({
      pt: 'Suspeito liberado com sucesso',
      en: 'Suspect release submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar liberar um suspeito',
      en: 'Oops, the application found an error while trying to release the suspect',
    }),
  });

  return (payload: EliminatePayload) => {
    request({
      action: TESTEMUNHA_OCULAR_ACTIONS.ELIMINATE_SUSPECT,
      ...payload,
    });
  };
}

export function useOnChooseTheCriminalAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'final-elimination',
    onSuccess: () => setStep(1),
    successMessage: translate({ pt: 'Criminoso escolhido com sucesso', en: 'Criminal chosen successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar escolher o criminoso',
      en: 'Oops, the application found an error while trying to choose the criminal',
    }),
  });

  return (payload: FinalEliminationPayload) => {
    request({
      action: TESTEMUNHA_OCULAR_ACTIONS.FINAL_ELIMINATION,
      ...payload,
    });
  };
}
