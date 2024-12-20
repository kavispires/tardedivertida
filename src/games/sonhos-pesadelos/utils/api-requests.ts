// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import type { SubmitDreamPayload, SubmitVotesPayload } from "./types";
import { SONHOS_PESADELOS_ACTIONS } from "./constants";

export function useOnSubmitDreamAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-dream",
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate(
      "Sonho submetido com sucesso",
      "Dream submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar seu sonho",
      "Oops, the application found an error while trying to submit your dream",
    ),
  });

  return (payload: SubmitDreamPayload) => {
    request({
      action: SONHOS_PESADELOS_ACTIONS.SUBMIT_DREAM,
      ...payload,
    });
  };
}

export function useOnSubmitVotesAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-votes",
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Votos submetidos com sucesso",
      "Votes submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar seus votos",
      "Oops, the application found an error while trying to submit your votes",
    ),
  });

  return (payload: SubmitVotesPayload) => {
    request({
      action: SONHOS_PESADELOS_ACTIONS.SUBMIT_VOTING,
      ...payload,
    });
  };
}
