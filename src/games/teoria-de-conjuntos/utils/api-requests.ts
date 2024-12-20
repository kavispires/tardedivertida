// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import type {
  SubmitEvaluationPayload,
  SubmitItemPlacementPayload,
  SubmitJudgePayload,
} from "./types";
import { TEORIA_DE_CONJUNTOS_ACTIONS } from "./constants";

export function useOnSubmitJudgeAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-judge",
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Juiz submetido com sucesso",
      "Judged submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: SubmitJudgePayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_JUDGE,
      ...payload,
    });
  };
}

export function useOnSubmitItemPlacementAPIRequest(
  setStep: UseStep["setStep"],
) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-item-placement",
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Item submetido com sucesso",
      "Item submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: SubmitItemPlacementPayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_ITEM_PLACEMENT,
      ...payload,
    });
  };
}

export function useOnSubmitEvaluationAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-evaluation",
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Avaliação submetida com sucesso",
      "Evaluation submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: SubmitEvaluationPayload) => {
    request({
      action: TEORIA_DE_CONJUNTOS_ACTIONS.SUBMIT_EVALUATION,
      ...payload,
    });
  };
}
