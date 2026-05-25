import { useTheme } from '../../context/ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="app-theme-switcher">
      Theme
      <select
        aria-label="Theme selector"
        value={theme}
        onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </label>
  );
}
