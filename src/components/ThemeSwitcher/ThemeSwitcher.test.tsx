import { ThemeProvider } from '../../context/ThemeContext';
import { renderWithUser, screen, waitFor } from '../../test-utils/render';
import { ThemeSwitcher } from './ThemeSwitcher';

describe('ThemeSwitcher', () => {
  it('renders with the current theme selected', async () => {
    const { user } = renderWithUser(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const selector = screen.getByRole('combobox', { name: 'Theme selector' });
    expect(selector).toBeInTheDocument();
    const currentTheme = (selector as HTMLSelectElement).value;
    expect(['light', 'dark']).toContain(currentTheme);

    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    await user.selectOptions(selector, nextTheme);
    expect(selector).toHaveValue(nextTheme);
  });

  it('updates theme wrapper class and localStorage when switched', async () => {
    const { user, container } = renderWithUser(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    const selector = screen.getByRole('combobox', { name: 'Theme selector' });
    await user.selectOptions(selector, 'dark');

    await waitFor(() => {
      const themeRoot = container.querySelector('.theme-root');
      expect(themeRoot).toHaveClass('theme-dark');
    });
    expect(localStorage.getItem('AppTheme')).toBe('dark');
  });
});
