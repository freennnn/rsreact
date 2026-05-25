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
  it('updates document theme attribute when theme changes', async () => {
    const { user } = renderWithUser(
      <ThemeProvider>
        <ThemeTestView />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(screen.getByText('dark')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Set light' }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(screen.getByText('light')).toBeInTheDocument();
  });
});
