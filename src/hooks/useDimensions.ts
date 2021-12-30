import { useGlobalState } from './index';

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
    console.warn(`Element of id #${elementId} is not present in the dom`);
  }

  return [element?.offsetWidth ?? 32, element?.offsetHeight ?? 32];
}
