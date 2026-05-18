import { useCallback, useState } from 'react';

type SetValue<T> = T | ((prevValue: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const rawValue = localStorage.getItem(key);
      if (rawValue === null) {
        return initialValue;
      }

      return JSON.parse(rawValue) as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: SetValue<T>) => {
      setStoredValue((prevValue) => {
        const nextValue =
          typeof value === 'function'
            ? (value as (prevValue: T) => T)(prevValue)
            : value;

        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Keep React state in sync even if storage write fails.
        }

        return nextValue;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}
