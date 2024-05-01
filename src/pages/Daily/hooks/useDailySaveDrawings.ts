import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useLanguage } from 'hooks/useLanguage';
import { DAILY_API, DAILY_API_ACTIONS } from 'services/adapters';
import { DrawingToSave } from '../games/Artista/utils/types';

export function useDailySaveDrawings(onSuccess: Function) {
  const { translate } = useLanguage();
  const { notification } = App.useApp();

  const query = useMutation({
    mutationKey: ['add-player'],
    mutationFn: async (payload: Dictionary<DrawingToSave>) =>
      await DAILY_API.run({
        action: DAILY_API_ACTIONS.SAVE_DRAWING,
        drawings: payload,
        language: Object.values(payload)?.[0]?.cardId?.split('-')?.[2] ?? 'pt',
      }),
    onSuccess: () => {
      notification.success({
        message: translate('Desenhos salvos com sucesso!', 'Drawings saved successfully!'),
        placement: 'bottomLeft',
      });
      onSuccess();
    },
    onError: (e: any) => {
      notification.error({
        message: translate(
          'Vixi, o aplicativo encontrou um erro ao tentar salvar desenhos',
          'Oops, the application failed when trying to save drawings'
        ),
        description: JSON.stringify(e.message),
        placement: 'bottomLeft',
      });
      console.error(e);
    },
  });

  return query;
}
