import { render, screen } from '@testing-library/react';
import { ButtonContainer } from './ButtonContainer';

describe('shared/ButtonContainer', function () {
  it('yields children', async function () {
    render(
      <ButtonContainer>
        <div data-testid="element">Hello</div>
      </ButtonContainer>
    );

    const component = await screen.findByTestId('button-container');
    const element = await screen.findByTestId('element');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('button-container');
    expect(element).toBeInTheDocument();
  });

  it('accepts a `className` argument', async function () {
    render(
      <ButtonContainer className="world">
        <div>Hello</div>
      </ButtonContainer>
    );

    const component = await screen.findByTestId('button-container');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('button-container');
    expect(component).toHaveClass('world');
  });
});
