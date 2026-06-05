import { useMutation } from '@tanstack/react-query';
// Ant Design Resources
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
// Internal
import type { DrawingToSave } from '../games/Picaco/utils/types';
import type { AnswerToSave } from '../games/TaNaCara/utils/types';
import type { SavePayload as ConexoesSavePayload } from '../games/Conexoes/utils/types';

export function useDailySaveDrawings(onSuccess: () => void) {
  const { translate } = useLanguage();
  const { notification } = App.useApp();

  const query = useMutation({
    mutationKey: ['daily-save-drawings'],
    mutationFn: async (payload: Dictionary<DrawingToSave>) =>
      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_DRAWING,
        drawings: payload,
        language: Object.values(payload)?.[0]?.cardId?.split('-')?.[2] ?? 'pt',
      }),
    onSuccess: () => {
      notification.success({
        title: translate({ pt: 'Desenhos salvos com sucesso!', en: 'Drawings saved successfully!' }),
        placement: 'bottomLeft',
      });
      onSuccess();
    },
    onError: (e: Error) => {
      notification.error({
        title: translate({
          pt: 'Vixi, o aplicativo encontrou um erro ao tentar salvar desenhos',
          en: 'Oops, the application failed when trying to save drawings',
        }),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
    },
  });

  return query;
}

export function useDailySaveTestimonies(onSuccess: () => void) {
  const { translate } = useLanguage();
  const { notification } = App.useApp();

  const query = useMutation({
    mutationKey: ['daily-save-testimonies'],
    mutationFn: async (payload: AnswerToSave[]) =>
      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_TESTIMONIES,
        answers: payload,
      }),
    onSuccess: () => {
      notification.success({
        title: translate({ pt: 'Respostas salvas com sucesso!', en: 'Answers saved successfully!' }),
        placement: 'bottomLeft',
      });
      onSuccess();
    },
    onError: (e: Error) => {
      notification.error({
        title: translate({
          pt: 'Vixi, o aplicativo encontrou um erro ao tentar salvar respostas',
          en: 'Oops, the application failed when trying to save answers',
        }),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
    },
  });

  return query;
}

export function useDailySaveConexoes(onSuccess: () => void) {
  const { translate } = useLanguage();
  const { notification } = App.useApp();

  const query = useMutation({
    mutationKey: ['daily-save-conexoes'],
    mutationFn: async (payload: ConexoesSavePayload) =>
      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_CONEXOES,
        ...payload,
      }),
    onSuccess: () => {
      notification.success({
        title: translate({ pt: 'Relações salvas com sucesso!', en: 'Relationships saved successfully!' }),
        placement: 'bottomLeft',
      });
      onSuccess();
    },
    onError: (e: Error) => {
      notification.error({
        title: translate({
          pt: 'Vixi, o aplicativo encontrou um erro ao tentar salvar relações',
          en: 'Oops, the application failed when trying to save relationships',
        }),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
    },
  });

  return query;
}
