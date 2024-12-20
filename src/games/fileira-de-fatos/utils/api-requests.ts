// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import type { SubmitScenarioOrderPayload } from "./types";
import { FILEIRA_DE_FATOS_ACTIONS } from "./constants";

export function useOnSubmitOrderingAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-order",
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Ordem submetida com sucesso",
      "Order submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ordem",
      "Oops, the application found an error while trying to submit your order",
    ),
  });

  return (payload: SubmitScenarioOrderPayload) => {
    request({
      action: FILEIRA_DE_FATOS_ACTIONS.SUBMIT_SCENARIO_ORDER,
      ...payload,
    });
  };
}
