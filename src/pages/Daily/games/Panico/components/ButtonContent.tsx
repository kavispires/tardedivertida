// Internal
import type { ButtonDictionaryEntry } from '../utils/data';

type ButtonContentProps = {
  /**
   * The unique key identifier of the button type
   */
  buttonKey: string;
  /**
   * The button configuration from BUTTONS_DICT
   */
  config: ButtonDictionaryEntry;
};

/**
 * Renders the content inside a button based on its type
 */
export function ButtonContent({ buttonKey, config }: ButtonContentProps) {
  // Switch based on button key to render different content types
  switch (buttonKey) {
    case 'BASIC_PRESS':
      return (
        <div className="button-content">
          <div className="button-content__text">{config.doc}</div>
        </div>
      );

    case 'BASIC_DO_NOT_PRESS':
      return (
        <div className="button-content">
          <div className="button-content__text">{config.doc}</div>
        </div>
      );

    // Placeholder for other button types
    default:
      return (
        <div className="button-content">
          <div className="button-content__text">{config.doc}</div>
        </div>
      );
  }
}
