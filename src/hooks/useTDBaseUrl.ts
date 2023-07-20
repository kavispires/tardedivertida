type TDUrlKind = 'tdi' | 'tdr' | 'tdi-data';

/**
 * Returns the URL for the given kind of resource
 * @param kind the kind of resource
 * @returns the URL for the given kind of resource
 */
export function useTDBaseUrl(kind: TDUrlKind): string {
  const base = process.env.REACT_APP_TD_BASE_URL;

  switch (kind) {
    case 'tdi':
      return `${base}/${process.env.REACT_APP_TDI_IMAGES}`;
    case 'tdr':
      return `${base}/${process.env.REACT_APP_TD_RESOURCES}`;
    case 'tdi-data':
      return `${base}/${process.env.REACT_APP_TDI_DATA}`;
    default:
      return '';
  }
}
