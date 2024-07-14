import React, { useState } from 'react'

import './ErrorButton.css'

interface ErrorButtonProps {
  children?: React.ReactNode
}
export function ErrorButton(props: ErrorButtonProps) {
  const [shouldProduceErrorInRender, setShouldProduceErrorInRender] = useState(false)

  const onButtonClick = () => {
    setShouldProduceErrorInRender(!shouldProduceErrorInRender)
  }

  if (shouldProduceErrorInRender) {
    throw new Error('I just wanted some github repos and all they gave me was an Error!')
  }
  return (
    <button type='button' onClick={onButtonClick} className='error-button'>
      {props.children}
    </button>
  )
}
