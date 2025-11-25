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

export function useDailySaveDrawings(onSuccess: GenericFunction) {
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
        title: translate('Desenhos salvos com sucesso!', 'Drawings saved successfully!'),
        placement: 'bottomLeft',
      });
      onSuccess();
    },
    onError: (e: Error) => {
      notification.error({
        title: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar salvar desenhos',
          'Oops, the application failed when trying to save drawings',
        ),
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
        title: translate('Respostas salvas com sucesso!', 'Answers saved successfully!'),
        placement: 'bottomLeft',
      });
      onSuccess();
    },
    onError: (e: Error) => {
      notification.error({
        title: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar salvar respostas',
          'Oops, the application failed when trying to save answers',
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
    },
  });

  return query;
}
