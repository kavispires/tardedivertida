import { useCallback } from 'react';
import { message, notification } from 'antd';
import { useGlobalState, useLoading } from './index';

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Wrapper around common firebase http call
 * @param {object} data
 * @param {Function} data.apiFunction
 * @param {Function} [data.onBeforeCall]
 * @param {Function} [data.onAfterCall]
 * @param {Function} [data.onError]
 * @param {string} [data.actionName] the name used in the loader hook
 * @param {string} [data.successMessage]
 * @param {string} [data.errorMessage]
 * @returns
 */
export function useAPICall({
  apiFunction,
  actionName = 'api-action',
  onBeforeCall = () => {},
  onAfterCall = () => {},
  onError = () => {},
  successMessage = 'API call was successful',
  errorMessage = 'API call has failed',
}) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [username] = useGlobalState('username');

  const onAPICall = debounce(
    useCallback(
      async (payload) => {
        try {
          setLoader(actionName, true);
          await onBeforeCall();
          const response = await apiFunction({
            gameId,
            gameName,
            playerName: username,
            ...payload,
          });

          if (response.data) {
            message.success(successMessage);
          }
        } catch (e) {
          notification.error({
            message: errorMessage,
            description: JSON.stringify(e.message),
            placement: 'bottomLeft',
          });
          console.error(e);
          onError();
        } finally {
          await onAfterCall();
          setLoader(actionName, false);
        }
      },
      [
        actionName,
        apiFunction,
        errorMessage,
        gameId,
        gameName,
        username,
        setLoader,
        successMessage,
        onBeforeCall,
        onAfterCall,
        onError,
      ]
    )
  );

  return onAPICall;
}
