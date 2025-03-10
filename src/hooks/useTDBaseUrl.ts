/**
 * Returns the URL for the given kind of resource
 * @param kind the kind of resource
 * @returns the URL for the given kind of resource
 */
export function useTDBaseUrl(library: 'images' | 'sprites' | 'resources' | 'classic'): string {
  const baseUrl = import.meta.env.VITE_TD_BASE_URL;
  switch (library) {
    case 'images':
      return `${baseUrl}/${import.meta.env.VITE_TD_IMAGES}`;
    case 'sprites':
      return `${baseUrl}/${import.meta.env.VITE_TD_SPRITES}`;
    case 'resources':
      return `${baseUrl}/${import.meta.env.VITE_TD_RESOURCES}`;
    case 'classic':
      return `${baseUrl}/${import.meta.env.VITE_TD_CLASSIC}`;
    default:
      throw new Error('Invalid library');
  }
}
