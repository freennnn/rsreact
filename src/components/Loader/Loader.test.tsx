import { render } from '../../test-utils/render';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders the loader element', () => {
    const { container } = render(<Loader />);

    expect(container.firstChild).toHaveClass('loader');
  });
});
