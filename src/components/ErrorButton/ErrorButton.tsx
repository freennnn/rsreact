import { useState } from 'react';

import './ErrorButton.css';

interface ErrorButtonProps {
  children: React.ReactNode;
}

export function ErrorButton({ children }: ErrorButtonProps) {
  const [shouldProduceErrorInRender, setShouldProduceErrorInRender] =
    useState(false);

  if (shouldProduceErrorInRender) {
    throw new Error(
      'I just wanted some github repos and all they gave me was an Error!'
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        setShouldProduceErrorInRender((prevState) => !prevState)
      }
      className="error-button"
    >
      {children}
    </button>
  );
}
