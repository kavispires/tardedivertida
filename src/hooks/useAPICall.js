import { useCallback } from 'react';
import { message, notification } from 'antd';
import { useGlobalState, useLoading } from './index';

/**
 * Wrapper around common firebase http call
 * @param {object} data
 * @param {Function} data.apiFunction
 * @param {string} [data.actionName] the name used in the loader hook
 * @param {Function} [data.setStep]
 * @param {number} [data.currentStep]
 * @param {number} [data.successStep]
 * @param {string} [data.successMessage]
 * @param {string} [data.errorMessage]
 * @returns
 */
export function useAPICall({
  apiFunction,
  actionName = 'api-action',
  setStep = () => {},
  currentStep = 0,
  successStep = 1,
  successMessage = 'API call was successful',
  errorMessage = 'API call has failed',
}) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');

  const onAPICall = useCallback(
    async (payload) => {
      try {
        setLoader(actionName, true);
        setStep(successStep);
        const response = await apiFunction({
          gameId,
          gameName,
          playerName: me,
          ...payload,
        });

        if (response.data) {
          message.success(successMessage);
        }
      } catch (e) {
        notification.error({
          message: errorMessage,
          description: JSON.stringify(e),
          placement: 'bottomLeft',
        });
        console.error(e);
        setStep(currentStep);
      } finally {
        setLoader(actionName, false);
      }
    },
    [
      actionName,
      apiFunction,
      currentStep,
      errorMessage,
      gameId,
      gameName,
      me,
      setLoader,
      setStep,
      successMessage,
      successStep,
    ]
  );

  return onAPICall;
}
