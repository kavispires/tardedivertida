import { App } from 'antd';
import { HttpsCallable } from 'firebase/functions';
import { useMutation } from '@tanstack/react-query';
// Hooks
import { useLoading } from './useLoading';
import { useGlobalState } from './useGlobalState';
import { useGameMeta } from './useGameMeta';

const debounce = (func: any, timeout = 1000): ((...args: any[]) => any) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export type UseAPICallArgs = {
  apiFunction: HttpsCallable<unknown, unknown>;
  actionName: string;
  onBeforeCall?: (...args: any) => any;
  onAfterCall?: (...args: any) => any;
  onError?: (...args: any) => any;
  onSuccess?: (...args: any) => any;
  successMessage?: string;
  errorMessage?: string;
};

/**
 * Wrapper around common firebase http call
 * @param data
 * @param data.apiFunction
 * @param [data.onBeforeCall] what to run before the api call
 * @param [data.onAfterCall] what to run after the api call
 * @param [data.onError] what to run if an error occurs
 * @param [data.onSuccess] what to run if success occurs
 * @param [data.actionName] the name used in the loader hook
 * @param [data.successMessage]
 * @param [data.errorMessage]
 * @returns
 */

/**
 * Wrapper around common firebase http call
 * @param options
 * @returns
 */
export function useAPICall({
  apiFunction,
  actionName = 'api-action',
  onBeforeCall = () => {},
  onAfterCall = () => {},
  onError = () => {},
  onSuccess = () => {},
  successMessage = 'API call was successful',
  errorMessage = 'API call has failed',
}: UseAPICallArgs): (...args: any[]) => any {
  const { message, notification } = App.useApp();
  const { setLoader } = useLoading();
  const { gameId, gameName } = useGameMeta();
  const [userId] = useGlobalState('userId');

  const query = useMutation({
    mutationKey: [actionName],
    mutationFn: (payload: {}) =>
      apiFunction({
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
    onError: (e: any) => {
      notification.error({
        message: errorMessage,
        description: JSON.stringify(e?.message),
        placement: 'bottomLeft',
      });
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
