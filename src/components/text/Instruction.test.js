import { render, screen } from '@testing-library/react';
import { Instruction } from './Instruction';

describe('shared/Instruction', () => {
  it('yields children', async () => {
    render(
      <Instruction>
        <div data-testid="element">Hello</div>
      </Instruction>,
    );

    const component = await screen.findByTestId('instruction');
    const element = await screen.findByTestId('element');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('instruction');
    expect(element).toBeInTheDocument();
  });

  it('accepts a `contained` argument that adds a background color', async () => {
    render(
      <Instruction contained>
        <div>Hello</div>
      </Instruction>,
    );

    const component = await screen.findByTestId('instruction');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('instruction');
    expect(component).toHaveClass('instruction--contained');
  });

  it('accepts a `white` argument that reverses the background color', async () => {
    render(
      <Instruction contained white>
        <div>Hello</div>
      </Instruction>,
    );

    const component = await screen.findByTestId('instruction');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('instruction');
    expect(component).toHaveClass('instruction--contained');
    expect(component).toHaveClass('instruction--white');
  });

  it('accepts a `className` argument', async () => {
    render(
      <Instruction className="world">
        <div>Hello</div>
      </Instruction>,
    );

    const component = await screen.findByTestId('instruction');

    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('instruction');
    expect(component).toHaveClass('world');
  });
});
