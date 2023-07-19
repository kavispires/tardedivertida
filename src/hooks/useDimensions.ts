import { print } from 'utils/helpers';
import { useGlobalState } from './useGlobalState';

/**
 * Get width and height of given element or from the screen
 * @param [elementId]
 * @returns representing width and height of the element
 */
export function useDimensions(elementId?: string): [number, number] {
  const [[sWidth, sHeight]] = useGlobalState('screenSize');

  if (!elementId) {
    return [sWidth, sHeight];
  }

  const element = document.getElementById(elementId);

  if (!element) {
    print(`Element of id #${elementId} is not present in the dom`, 'warn');
    return [sWidth, sHeight];
  }

  return [element?.offsetWidth ?? 32, element?.offsetHeight ?? 32];
}
