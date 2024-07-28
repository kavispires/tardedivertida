/**
 * Returns the URL for the given kind of resource
 * @param kind the kind of resource
 * @returns the URL for the given kind of resource
 */
export function useTDBaseUrl(library: 'images' | 'sprites' | 'resources' | 'classic'): string {
  const baseUrl = process.env.REACT_APP_TD_BASE_URL;

  switch (library) {
    case 'images':
      return `${baseUrl}/${process.env.REACT_APP_TD_IMAGES}`;
    case 'sprites':
      return `${baseUrl}/${process.env.REACT_APP_TD_SPRITES}`;
    case 'resources':
      return `${baseUrl}/${process.env.REACT_APP_TD_RESOURCES}`;
    case 'classic':
      return `${baseUrl}/${process.env.REACT_APP_TD_CLASSIC}`;
    default:
      throw new Error('Invalid library');
  }
}
