import { useMutation } from '@tanstack/react-query';
// Ant Design Resources
import { App } from 'antd';
// Services
import { GAME_API, type GAME_API_COMMON_ACTIONS } from 'services/adapters';
// Internal
import { useLoading } from './useLoading';
import { useGlobalState } from './useGlobalState';
import { useGameMeta } from './useGameMeta';

const debounce = (func: any, timeout = 1500): ((...args: any[]) => any) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export type UseGameActionRequestArgs = {
  actionName: string;
  onBeforeCall?: (...args: any) => any;
  onAfterCall?: (...args: any) => any;
  onError?: (...args: any) => any;
  onSuccess?: (...args: any) => any;
  successMessage?: string;
  errorMessage?: string;
};

interface Payload {
  action: keyof typeof GAME_API_COMMON_ACTIONS | string;
  [key: string]: any;
}

/**
 * Custom hook for making a game action request.
 *
 * @param options - The options for the game action request.
 * @param options.actionName - The name of the action.
 * @param [options.onBeforeCall] - The callback function to be called before making the API call.
 * @param [options.onAfterCall] - The callback function to be called after making the API call.
 * @param [options.onError] - The callback function to be called when an error occurs during the API call.
 * @param [options.onSuccess] - The callback function to be called when the API call is successful.
 * @param [options.successMessage] - The success message to be displayed.
 * @param [options.errorMessage] - The error message to be displayed.
 * @returns The debounced function for making the game action request.
 */
export function useGameActionRequest({
  actionName,
  onBeforeCall = () => {},
  onAfterCall = () => {},
  onError = () => {},
  onSuccess = () => {},
  successMessage = 'API call was successful',
  errorMessage = 'API call has failed',
}: UseGameActionRequestArgs): (...args: any[]) => any {
  const { message, notification } = App.useApp();
  const { setLoader } = useLoading();
  const { gameId, gameName } = useGameMeta();
  const [userId] = useGlobalState('userId');

  const query = useMutation({
    mutationKey: [actionName],
    mutationFn: (payload: Payload) =>
      GAME_API.run({
        gameId,
        gameName,
        playerId: userId,
        ...payload,
      }),
    onMutate: async () => {
      setLoader(actionName, true);
      await onBeforeCall();
    },
    onSuccess: async () => {
      await onSuccess();
      message.success(successMessage);
    },
    onError: (e: Error) => {
      notification.error({
        message: errorMessage,
        description: JSON.stringify(e?.message),
        placement: 'bottomLeft',
      });
      // biome-ignore lint/suspicious/noConsole: on purpose
      console.error(e);
      onError();
    },
    onSettled: async () => {
      await onAfterCall();
      setLoader(actionName, false);
    },
  });

  return debounce(query.mutate);
}
