// Hooks
import { useGameActionRequest } from "hooks/useGameActionRequest";
import { useLanguage } from "hooks/useLanguage";
import type { UseStep } from "hooks/useStep";
// Internal
import type {
  SubmitMovieSelectionPayload,
  SubmitMovieEliminationPayload,
} from "./types";
import { VAMOS_AO_CINEMA_ACTIONS } from "./constants";

export function useOnSubmitMovieSelectionAPIRequest(
  setStep: UseStep["setStep"],
) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-action",

    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Ação submetida com sucesso",
      "Action submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: SubmitMovieSelectionPayload) => {
    request({
      action: VAMOS_AO_CINEMA_ACTIONS.SELECT_MOVIE,
      ...payload,
    });
  };
}

export function useOnSubmitMovieEliminationAPIRequest(
  setStep: UseStep["setStep"],
) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-action",
    onBeforeCall: () =>
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      }),
    onSuccess: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      "Ação submetida com sucesso",
      "Action submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: SubmitMovieEliminationPayload) => {
    request({
      action: VAMOS_AO_CINEMA_ACTIONS.ELIMINATE_MOVIE,
      ...payload,
    });
  };
}

export function useOnSubmitMoviePosterAPIRequest(setStep: UseStep["setStep"]) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: "submit-action",
    onError: () => setStep(0),
    successMessage: translate(
      "Ação submetida com sucesso",
      "Action submitted successfully",
    ),
    errorMessage: translate(
      "Vixi, o aplicativo encontrou um erro ao tentar enviar sua ação",
      "Oops, the application found an error while trying to submit your action",
    ),
  });

  return (payload: SubmitMovieEliminationPayload) => {
    request({
      action: VAMOS_AO_CINEMA_ACTIONS.VOTE_FOR_POSTER,
      ...payload,
    });
  };
}
