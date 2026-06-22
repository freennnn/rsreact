import { ThemeProvider, useTheme } from './ThemeContext';
import { renderWithUser, screen } from '../test-utils/render';

function ThemeTestView() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>{theme}</p>
      <button type="button" onClick={() => setTheme('light')}>
        Set light
      </button>
      <button type="button" onClick={() => setTheme('dark')}>
        Set dark
      </button>
    </div>
  );
}

describe('ThemeContext', () => {
  it('updates theme wrapper class when theme changes', async () => {
    const { user, container } = renderWithUser(
      <ThemeProvider>
        <ThemeTestView />
      </ThemeProvider>
    );

    const themeRoot = container.querySelector('.theme-root');
    expect(themeRoot).toBeInTheDocument();
    expect(themeRoot).toHaveClass('theme-dark');
    expect(screen.getByText('dark')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Set light' }));

    expect(themeRoot).toHaveClass('theme-light');
    expect(screen.getByText('light')).toBeInTheDocument();
  });
});
