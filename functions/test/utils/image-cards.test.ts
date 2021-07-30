import 'jest';
import * as imageCardUtils from '../../src/utils/image-cards';

describe('image-cards', () => {
  describe('getImageCards', () => {
    test('it gets list of card ids based on the number of decks', () => {
      let result = imageCardUtils.getImageCards(1);
      expect(result).toHaveLength(84);

      result = imageCardUtils.getImageCards(4);
      expect(result).toHaveLength(84 * 4);
    });

    test('it throws an error if more decks are requested than available', () => {
      function catcher() {
        return imageCardUtils.getImageCards(5000);
      }
      expect(catcher).toThrow('5000 image decks were requested while game only has 7 available');
    });
  });
});
