// Hooks
import { useGameActionRequest } from 'hooks/useGameActionRequest';
import { useLanguage } from 'hooks/useLanguage';
import type { UseStep } from 'hooks/useStep';
// Internal
import type {
  SubmitDefensePayload,
  SubmitPlayCardPayload,
  SubmitSecretCluePayload,
  SubmitVotePayload,
} from './types';
import { DETETIVES_IMAGINATIVOS_ACTIONS } from './constants';

export function useOnSubmitSecretClueAPIRequest(setStep: UseStep['setStep']) {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-secret-clue',
    onBeforeCall: () => setStep(3),
    onError: () => setStep(0),
    successMessage: translate({
      pt: 'Pista Secreta submetida com sucesso',
      en: 'Secret clue submitted successfully',
    }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua pista secreta',
      en: 'Oops, the application found an error while trying to submit your secret clue',
    }),
  });

  return (payload: SubmitSecretCluePayload) => {
    request({
      action: DETETIVES_IMAGINATIVOS_ACTIONS.SUBMIT_CLUE,
      ...payload,
    });
  };
}

export function useOnPlayCardAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'play-card',
    successMessage: translate({ pt: 'Carta enviada com sucesso', en: 'Card submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      en: 'Oops, the application found an error while trying to submit your card',
    }),
  });

  return (payload: SubmitPlayCardPayload) => {
    request({
      action: DETETIVES_IMAGINATIVOS_ACTIONS.PLAY_CARD,
      ...payload,
    });
  };
}

export function useOnFinishDefenseRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'finish-defense',
    successMessage: translate({ pt: 'Defesa concluída com sucesso', en: 'Defense concluded successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar concluir sua defesa',
      en: 'Oops, the application found an error while trying to conclude your defense',
    }),
  });

  return (payload: SubmitDefensePayload) => {
    request({
      action: DETETIVES_IMAGINATIVOS_ACTIONS.DEFEND,
      ...payload,
    });
  };
}

export function useOnSubmitVoteAPIRequest() {
  const { translate } = useLanguage();

  const request = useGameActionRequest({
    actionName: 'submit-vote',
    successMessage: translate({ pt: 'Voto enviado com sucesso', en: 'Vote submitted successfully' }),
    errorMessage: translate({
      pt: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      en: 'Oops, the application found an error while trying to submit your vote',
    }),
  });

  return (payload: SubmitVotePayload) => {
    request({
      action: DETETIVES_IMAGINATIVOS_ACTIONS.SUBMIT_VOTE,
      ...payload,
    });
  };
}
