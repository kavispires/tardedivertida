/**
 * Returns the URL for the given kind of resource
 * @param kind the kind of resource
 * @returns the URL for the given kind of resource
 */
export function useTDBaseUrl(library: 'assets' | 'classic' | 'images' | 'sprites' | 'resources'): string {
  const baseUrl = import.meta.env.VITE__TD_BASE_URL;
  switch (library) {
    case 'assets':
      return `${baseUrl}/${import.meta.env.VITE__TD_ASSETS}`;
    case 'classic':
      return `${baseUrl}/${import.meta.env.VITE__TD_CLASSIC}`;
    case 'images':
      return `${baseUrl}/${import.meta.env.VITE__TD_IMAGES}`;
    case 'resources':
      return `${baseUrl}/${import.meta.env.VITE__TD_RESOURCES}`;
    case 'sprites':
      return `${baseUrl}/${import.meta.env.VITE__TD_SPRITES}`;
    default:
      throw new Error('Invalid library');
  }
}
